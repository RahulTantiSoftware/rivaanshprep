package com.rivaanshprep.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Username or email is required")
    @JsonAlias({"email", "identifier"})
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // Backwards-compatibility getter/setter for email
    public String getEmail() {
        return username;
    }

    public void setEmail(String email) {
        this.username = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
