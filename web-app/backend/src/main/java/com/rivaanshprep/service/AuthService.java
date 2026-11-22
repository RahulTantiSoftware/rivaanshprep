package com.rivaanshprep.service;

import com.rivaanshprep.dto.*;
import com.rivaanshprep.entity.*;
import com.rivaanshprep.exception.BadRequestException;
import com.rivaanshprep.repository.*;
import com.rivaanshprep.security.JwtTokenProvider;
import com.rivaanshprep.security.UserPrincipal;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCKOUT_DURATION_MINUTES = 15;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    @Value("${app.jwt.cookie-name:rp_refresh_token}")
    private String cookieName;

    @Value("${app.jwt.refresh-token-expiration-ms:604800000}")
    private long refreshTokenExpirationMs;

    public AuthService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailService = emailService;
    }

    @Transactional
    public UserProfileResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String username = (request.getUsername() != null && !request.getUsername().isBlank())
                ? request.getUsername().trim().toLowerCase()
                : normalizedEmail.split("@")[0];

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("An account with this email address already exists.");
        }
        if (userRepository.existsByUsername(username)) {
            throw new BadRequestException("Username '" + username + "' is already taken. Please choose another username.");
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setUsername(username);
        user.setFullName(request.getFullName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setTargetBoard(request.getTargetBoard() != null ? request.getTargetBoard() : "CBSE Class 10");
        
        // Security policy: Public registrations are strictly assigned ROLE_STUDENT.
        // Admin accounts can only be created internally by the backend.
        user.setRole(Role.ROLE_STUDENT);
        user.setActive(true);
        user.setSubscriptionPlan("FREE");
        user.setSubscriptionStatus("INACTIVE");

        User savedUser = userRepository.save(user);
        return UserProfileResponse.fromEntity(savedUser);
    }

    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        String identifier = (request.getUsername() != null ? request.getUsername() : request.getEmail()).trim().toLowerCase();
        User user = userRepository.findByEmailOrUsername(identifier)
                .orElseThrow(() -> new BadCredentialsException("Invalid username/email or password"));

        // Check account active status
        if (!user.isActive()) {
            throw new BadCredentialsException("Your account is deactivated. Please contact administrator.");
        }

        // Check account lockout status
        if (user.isAccountLocked()) {
            throw new LockedException("Account is temporarily locked due to 5 consecutive failed login attempts. Please try again after " + user.getLockoutUntil());
        }

        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                user.setLockoutUntil(LocalDateTime.now().plusMinutes(LOCKOUT_DURATION_MINUTES));
                userRepository.save(user);
                log.warn("Account locked for user: {} due to {} failed attempts", identifier, attempts);
                throw new LockedException("Too many failed login attempts. Account locked for " + LOCKOUT_DURATION_MINUTES + " minutes.");
            }
            userRepository.save(user);
            throw new BadCredentialsException("Invalid username/email or password");
        }

        // Reset failed login attempts on successful login & record last login timestamp
        user.setFailedLoginAttempts(0);
        user.setLockoutUntil(null);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Create Refresh Token
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", ""));
        refreshToken.setFamilyId(UUID.randomUUID().toString());
        refreshToken.setExpiresAt(LocalDateTime.now().plusSeconds(refreshTokenExpirationMs / 1000));
        refreshToken.setIpAddress(getClientIp(httpRequest));
        refreshToken.setUserAgent(httpRequest.getHeader("User-Agent"));
        refreshTokenRepository.save(refreshToken);

        // Set HttpOnly Secure Cookie
        addRefreshTokenCookie(httpResponse, refreshToken.getToken(), refreshTokenExpirationMs / 1000);

        // Generate Access Token
        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = jwtTokenProvider.generateAccessToken(principal);

        return new AuthResponse(accessToken, jwtTokenProvider.getAccessTokenExpirationMs(), UserProfileResponse.fromEntity(user));
    }

    @Transactional
    public AuthResponse refreshToken(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        String rawToken = extractCookieValue(httpRequest, cookieName)
                .orElseThrow(() -> new BadRequestException("Missing refresh token cookie"));

        RefreshToken token = refreshTokenRepository.findByToken(rawToken)
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        // Check if token was previously revoked (Reuse Detection / Token Theft)
        if (token.isRevoked()) {
            log.warn("🚨 REUSE OF REVOKED REFRESH TOKEN DETECTED! Family ID: {}. Revoking all tokens in family.", token.getFamilyId());
            refreshTokenRepository.revokeAllByFamilyId(token.getFamilyId());
            clearRefreshTokenCookie(httpResponse);
            throw new BadRequestException("Token reuse detected. All sessions in this chain have been terminated for your security. Please log in again.");
        }

        if (token.isExpired()) {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
            clearRefreshTokenCookie(httpResponse);
            throw new BadRequestException("Refresh token has expired. Please log in again.");
        }

        User user = token.getUser();
        if (user.isAccountLocked()) {
            throw new LockedException("Account is locked. Please try again later.");
        }

        // Invalidate old token (Rotation)
        token.setRevoked(true);
        refreshTokenRepository.save(token);

        // Issue new token in same family
        RefreshToken newRefreshToken = new RefreshToken();
        newRefreshToken.setUser(user);
        newRefreshToken.setToken(UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", ""));
        newRefreshToken.setFamilyId(token.getFamilyId());
        newRefreshToken.setExpiresAt(LocalDateTime.now().plusSeconds(refreshTokenExpirationMs / 1000));
        newRefreshToken.setIpAddress(getClientIp(httpRequest));
        newRefreshToken.setUserAgent(httpRequest.getHeader("User-Agent"));
        refreshTokenRepository.save(newRefreshToken);

        addRefreshTokenCookie(httpResponse, newRefreshToken.getToken(), refreshTokenExpirationMs / 1000);

        UserPrincipal principal = UserPrincipal.create(user);
        String newAccessToken = jwtTokenProvider.generateAccessToken(principal);

        return new AuthResponse(newAccessToken, jwtTokenProvider.getAccessTokenExpirationMs(), UserProfileResponse.fromEntity(user));
    }

    @Transactional
    public MessageResponse logout(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        extractCookieValue(httpRequest, cookieName).ifPresent(rawToken -> {
            refreshTokenRepository.findByToken(rawToken).ifPresent(token -> {
                token.setRevoked(true);
                refreshTokenRepository.save(token);
            });
        });

        clearRefreshTokenCookie(httpResponse);
        return MessageResponse.ok("Successfully logged out");
    }

    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Invalidate old tokens
            passwordResetTokenRepository.invalidateAllByUser(user);

            // Generate secure reset token
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setUser(user);
            resetToken.setToken(UUID.randomUUID().toString());
            resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(30));
            passwordResetTokenRepository.save(resetToken);

            emailService.sendPasswordResetEmail(user.getEmail(), resetToken.getToken());
        }

        // Generic response to prevent user enumeration
        return MessageResponse.ok("If an account with that email exists, password reset instructions have been sent.");
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token"));

        if (resetToken.isUsed() || resetToken.isExpired()) {
            throw new BadRequestException("Password reset link is expired or has already been used");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setFailedLoginAttempts(0);
        user.setLockoutUntil(null);
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        // Security best practice: Revoke all existing refresh tokens
        refreshTokenRepository.revokeAllByUser(user);

        log.info("Password reset successfully completed for user: {}", user.getEmail());
        return MessageResponse.ok("Password has been successfully updated. You may now log in with your new credentials.");
    }

    private void addRefreshTokenCookie(HttpServletResponse response, String tokenValue, long maxAgeSeconds) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, tokenValue)
                .httpOnly(true)
                .secure(false) // set to true when deployed over HTTPS
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofSeconds(maxAgeSeconds))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
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

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
