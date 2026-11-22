package com.rivaanshprep.controller;

import com.rivaanshprep.dto.*;
import com.rivaanshprep.security.UserPrincipal;
import com.rivaanshprep.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserProfileResponse response = userService.getProfile(principal.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileResponse response = userService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        MessageResponse response = userService.changePassword(principal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<ActiveSessionResponse>> getActiveSessions(
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest request) {
        List<ActiveSessionResponse> sessions = userService.getActiveSessions(principal.getId(), request);
        return ResponseEntity.ok(sessions);
    }

    @PostMapping("/sessions/revoke-others")
    public ResponseEntity<MessageResponse> revokeOtherSessions(
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest request) {
        MessageResponse response = userService.revokeOtherSessions(principal.getId(), request);
        return ResponseEntity.ok(response);
    }
}
