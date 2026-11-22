package com.rivaanshprep.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ChangePasswordRequest {

    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^()_+\\-={}\\[\\]:;\"'<>,.?/|~`])[A-Za-z\\d@$!%*?&#^()_+\\-={}\\[\\]:;\"'<>,.?/|~`]{8,64}$",
        message = "New password must be 8-64 characters, contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character"
    )
    private String newPassword;

    // Getters and Setters
    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
