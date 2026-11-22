package com.rivaanshprep.service;

import com.rivaanshprep.dto.*;
import com.rivaanshprep.entity.RefreshToken;
import com.rivaanshprep.entity.User;
import com.rivaanshprep.exception.BadRequestException;
import com.rivaanshprep.exception.ResourceNotFoundException;
import com.rivaanshprep.repository.RefreshTokenRepository;
import com.rivaanshprep.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.jwt.cookie-name:rp_refresh_token}")
    private String cookieName;

    public UserService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String userId) {
        User user = findUserById(userId);
        return UserProfileResponse.fromEntity(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(String userId, UpdateProfileRequest request) {
        User user = findUserById(userId);

        user.setFullName(request.getFullName().trim());
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
        }
        if (request.getTargetBoard() != null && !request.getTargetBoard().isBlank()) {
            user.setTargetBoard(request.getTargetBoard().trim());
        }

        User savedUser = userRepository.save(user);
        return UserProfileResponse.fromEntity(savedUser);
    }

    @Transactional
    public MessageResponse changePassword(String userId, ChangePasswordRequest request) {
        User user = findUserById(userId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password does not match");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new BadRequestException("New password must be different from your current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return MessageResponse.ok("Password changed successfully");
    }

    @Transactional(readOnly = true)
    public List<ActiveSessionResponse> getActiveSessions(String userId, HttpServletRequest request) {
        User user = findUserById(userId);
        List<RefreshToken> activeTokens = refreshTokenRepository.findByUserAndRevokedFalse(user);

        String currentRawToken = extractCookieValue(request, cookieName).orElse("");

        return activeTokens.stream()
                .filter(token -> !token.isExpired())
                .map(token -> new ActiveSessionResponse(
                        token.getId(),
                        token.getIpAddress(),
                        token.getUserAgent(),
                        token.getCreatedAt(),
                        token.getToken().equals(currentRawToken)
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageResponse revokeOtherSessions(String userId, HttpServletRequest request) {
        User user = findUserById(userId);
        String currentRawToken = extractCookieValue(request, cookieName)
                .orElseThrow(() -> new BadRequestException("Current session could not be verified"));

        RefreshToken currentSession = refreshTokenRepository.findByToken(currentRawToken)
                .orElseThrow(() -> new BadRequestException("Current session invalid"));

        refreshTokenRepository.revokeOtherSessions(user, currentSession.getId());
        return MessageResponse.ok("All other active sessions have been logged out");
    }

    private User findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private Optional<String> extractCookieValue(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return Optional.empty();
        }
        return Arrays.stream(cookies)
                .filter(c -> name.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }
}
