package com.rivaanshprep.dto;

import com.rivaanshprep.entity.Role;
import com.rivaanshprep.entity.User;

import java.time.LocalDateTime;

public class UserProfileResponse {

    private String id;
    private String email;
    private String username;
    private String fullName;
    private String phoneNumber;
    private String targetBoard;
    private Role role;
    private boolean emailVerified;
    private boolean active;
    private String subscriptionPlan;
    private String subscriptionStatus;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    public static UserProfileResponse fromEntity(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setUsername(user.getUsername() != null ? user.getUsername() : user.getEmail().split("@")[0]);
        response.setFullName(user.getFullName());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setTargetBoard(user.getTargetBoard());
        response.setRole(user.getRole());
        response.setEmailVerified(user.isEmailVerified());
        response.setActive(user.isActive());
        response.setSubscriptionPlan(user.getSubscriptionPlan());
        response.setSubscriptionStatus(user.getSubscriptionStatus());
        response.setCreatedAt(user.getCreatedAt());
        response.setLastLoginAt(user.getLastLoginAt());
        return response;
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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getSubscriptionPlan() {
        return subscriptionPlan;
    }

    public void setSubscriptionPlan(String subscriptionPlan) {
        this.subscriptionPlan = subscriptionPlan;
    }

    public String getSubscriptionStatus() {
        return subscriptionStatus;
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
