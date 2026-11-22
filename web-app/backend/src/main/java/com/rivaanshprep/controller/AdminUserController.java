package com.rivaanshprep.controller;

import com.rivaanshprep.dto.AdminCreateUserRequest;
import com.rivaanshprep.dto.UserProfileResponse;
import com.rivaanshprep.entity.Role;
import com.rivaanshprep.entity.User;
import com.rivaanshprep.exception.BadRequestException;
import com.rivaanshprep.exception.ResourceNotFoundException;
import com.rivaanshprep.repository.PasswordResetTokenRepository;
import com.rivaanshprep.repository.RefreshTokenRepository;
import com.rivaanshprep.repository.UserRepository;
import com.rivaanshprep.security.UserPrincipal;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private static final Logger log = LoggerFactory.getLogger(AdminUserController.class);

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserController(UserRepository userRepository,
                               RefreshTokenRepository refreshTokenRepository,
                               PasswordResetTokenRepository passwordResetTokenRepository,
                               PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 1. High-level dashboard statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByActiveTrue();
        long subscribedUsers = userRepository.countBySubscriptionStatus("ACTIVE");
        long adminUsers = userRepository.countByRole(Role.ROLE_ADMIN);
        long studentUsers = userRepository.countByRole(Role.ROLE_STUDENT);

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("inactiveUsers", totalUsers - activeUsers);
        stats.put("subscribedUsers", subscribedUsers);
        stats.put("adminUsers", adminUsers);
        stats.put("studentUsers", studentUsers);
        return ResponseEntity.ok(stats);
    }

    // 2. Search and list users with optional filters
    @GetMapping("/users")
    public ResponseEntity<List<UserProfileResponse>> listUsers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String plan) {

        List<User> users;
        if (query != null && !query.trim().isEmpty()) {
            users = userRepository.searchUsers(query.trim());
        } else {
            users = userRepository.findAll();
            // Sort by creation date descending
            users.sort((a, b) -> {
                if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
                return b.getCreatedAt().compareTo(a.getCreatedAt());
            });
        }

        // Apply filters in memory
        List<UserProfileResponse> result = users.stream()
                .filter(u -> {
                    if (role != null && !role.trim().isEmpty() && !role.equalsIgnoreCase("all")) {
                        if (!u.getRole().name().equalsIgnoreCase(role) &&
                            !u.getRole().name().replace("ROLE_", "").equalsIgnoreCase(role)) {
                            return false;
                        }
                    }
                    if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("all")) {
                        if (status.equalsIgnoreCase("active") && !u.isActive()) return false;
                        if (status.equalsIgnoreCase("inactive") && u.isActive()) return false;
                    }
                    if (plan != null && !plan.trim().isEmpty() && !plan.equalsIgnoreCase("all")) {
                        if (!u.getSubscriptionPlan().equalsIgnoreCase(plan)) return false;
                    }
                    return true;
                })
                .map(UserProfileResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // 3. Admin manually creates a new user account
    @PostMapping("/users")
    @Transactional
    public ResponseEntity<UserProfileResponse> createUser(@Valid @RequestBody AdminCreateUserRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String normalizedUsername = request.getUsername().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("An account with email " + normalizedEmail + " already exists.");
        }
        if (userRepository.existsByUsername(normalizedUsername)) {
            throw new BadRequestException("Username " + normalizedUsername + " is already taken.");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setUsername(normalizedUsername);
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.ROLE_STUDENT);
        user.setTargetBoard(request.getTargetBoard() != null ? request.getTargetBoard() : "CBSE Class 10");
        user.setSubscriptionPlan(request.getSubscriptionPlan() != null ? request.getSubscriptionPlan().toUpperCase() : "FREE");
        user.setSubscriptionStatus(request.getSubscriptionStatus() != null ? request.getSubscriptionStatus().toUpperCase() : "INACTIVE");
        user.setActive(request.isActive());
        user.setEmailVerified(true);

        User saved = userRepository.save(user);
        log.info("Admin created new user account: username={}, email={}, role={}", saved.getUsername(), saved.getEmail(), saved.getRole());
        return ResponseEntity.ok(UserProfileResponse.fromEntity(saved));
    }

    // 4. Toggle account active / inactive status
    @PutMapping("/users/{id}/status")
    @Transactional
    public ResponseEntity<UserProfileResponse> toggleUserStatus(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal UserPrincipal currentAdmin) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (user.getId().equals(currentAdmin.getId())) {
            throw new BadRequestException("You cannot disable your own administrator account.");
        }

        boolean newActive = payload.containsKey("active") ? Boolean.parseBoolean(payload.get("active").toString()) : !user.isActive();
        user.setActive(newActive);

        // If reactivating, unlock account if locked
        if (newActive) {
            user.setLockoutUntil(null);
            user.setFailedLoginAttempts(0);
        }

        User updated = userRepository.save(user);
        log.info("Admin {} changed active status of user {} ({}) to {}", currentAdmin.getUsername(), user.getUsername(), user.getId(), newActive);
        return ResponseEntity.ok(UserProfileResponse.fromEntity(updated));
    }

    // 5. Update user subscription plan and status
    @PutMapping("/users/{id}/subscription")
    @Transactional
    public ResponseEntity<UserProfileResponse> updateSubscription(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String plan = payload.getOrDefault("plan", "FREE").toUpperCase();
        String status = payload.getOrDefault("status", "ACTIVE").toUpperCase();

        user.setSubscriptionPlan(plan);
        user.setSubscriptionStatus(status);

        User updated = userRepository.save(user);
        log.info("Subscription updated for user {}: plan={}, status={}", user.getUsername(), plan, status);
        return ResponseEntity.ok(UserProfileResponse.fromEntity(updated));
    }

    // 6. Update user role (ROLE_STUDENT <-> ROLE_ADMIN)
    @PutMapping("/users/{id}/role")
    @Transactional
    public ResponseEntity<UserProfileResponse> updateUserRole(
            @PathVariable String id,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserPrincipal currentAdmin) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String roleStr = payload.getOrDefault("role", "ROLE_STUDENT").toUpperCase();
        if (!roleStr.startsWith("ROLE_")) {
            roleStr = "ROLE_" + roleStr;
        }

        Role newRole;
        try {
            newRole = Role.valueOf(roleStr);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role. Permitted: ROLE_STUDENT, ROLE_ADMIN");
        }

        // Prevent admin from demoting self if only 1 admin
        if (user.getId().equals(currentAdmin.getId()) && newRole != Role.ROLE_ADMIN) {
            throw new BadRequestException("You cannot remove admin privileges from your own account.");
        }

        user.setRole(newRole);
        User updated = userRepository.save(user);
        log.info("Role updated for user {}: {}", user.getUsername(), newRole);
        return ResponseEntity.ok(UserProfileResponse.fromEntity(updated));
    }

    // 7. Admin resets user password
    @PutMapping("/users/{id}/reset-password")
    @Transactional
    public ResponseEntity<Map<String, String>> resetUserPassword(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String newPassword = payload.get("newPassword");
        if (newPassword == null || newPassword.trim().length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters.");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword.trim()));
        user.setLockoutUntil(null);
        user.setFailedLoginAttempts(0);
        userRepository.save(user);

        log.info("Admin reset password for user: {}", user.getUsername());
        return ResponseEntity.ok(Map.of("message", "Password for " + user.getUsername() + " was successfully updated."));
    }

    // 8. Delete user account
    @DeleteMapping("/users/{id}")
    @Transactional
    public ResponseEntity<Map<String, String>> deleteUser(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentAdmin) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (user.getId().equals(currentAdmin.getId())) {
            throw new BadRequestException("You cannot delete your own administrator account.");
        }

        // Clean up associated tokens
        refreshTokenRepository.deleteByUser(user);
        passwordResetTokenRepository.deleteByUser(user);

        String username = user.getUsername();
        userRepository.delete(user);
        log.info("Admin {} deleted user account: {}", currentAdmin.getUsername(), username);

        return ResponseEntity.ok(Map.of("message", "User account @" + username + " has been permanently deleted."));
    }
}
