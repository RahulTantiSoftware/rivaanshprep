package com.rivaanshprep.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email", unique = true),
    @Index(name = "idx_user_username", columnList = "username", unique = true)
})
public class User {

    @Id
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    private String id;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(unique = true, length = 50)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "target_board", length = 50)
    private String targetBoard = "CBSE Class 10";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.ROLE_STUDENT;

    @Column(name = "failed_login_attempts", nullable = false)
    private int failedLoginAttempts = 0;

    @Column(name = "lockout_until")
    private LocalDateTime lockoutUntil;

    @Column(name = "is_email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "subscription_plan", length = 30)
    private String subscriptionPlan = "FREE";

    @Column(name = "subscription_status", length = 20)
    private String subscriptionStatus = "INACTIVE";

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.email != null) {
            this.email = this.email.trim().toLowerCase();
        }
        if (this.username != null) {
            this.username = this.username.trim().toLowerCase();
        } else if (this.email != null) {
            this.username = this.email.split("@")[0].toLowerCase();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.email != null) {
            this.email = this.email.trim().toLowerCase();
        }
        if (this.username != null) {
            this.username = this.username.trim().toLowerCase();
        }
    }

    public boolean isAccountLocked() {
        if (lockoutUntil == null) {
            return false;
        }
        if (lockoutUntil.isAfter(LocalDateTime.now())) {
            return true;
        }
        return false;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getTargetBoard() {
        return targetBoard;
    }

    public void setTargetBoard(String targetBoard) {
        this.targetBoard = targetBoard;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public int getFailedLoginAttempts() {
        return failedLoginAttempts;
    }

    public void setFailedLoginAttempts(int failedLoginAttempts) {
        this.failedLoginAttempts = failedLoginAttempts;
    }

    public LocalDateTime getLockoutUntil() {
        return lockoutUntil;
    }

    public void setLockoutUntil(LocalDateTime lockoutUntil) {
        this.lockoutUntil = lockoutUntil;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getSubscriptionPlan() {
        return subscriptionPlan != null ? subscriptionPlan : "FREE";
    }

    public void setSubscriptionPlan(String subscriptionPlan) {
        this.subscriptionPlan = subscriptionPlan;
    }

    public String getSubscriptionStatus() {
        return subscriptionStatus != null ? subscriptionStatus : "INACTIVE";
    }

    public void setSubscriptionStatus(String subscriptionStatus) {
        this.subscriptionStatus = subscriptionStatus;
    }

    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }

    public void setLastLoginAt(LocalDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }
}
