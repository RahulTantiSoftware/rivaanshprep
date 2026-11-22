package com.rivaanshprep.dto;

import java.time.LocalDateTime;

public class ActiveSessionResponse {

    private String id;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime createdAt;
    private boolean current;

    public ActiveSessionResponse(String id, String ipAddress, String userAgent, LocalDateTime createdAt, boolean current) {
        this.id = id;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.createdAt = createdAt;
        this.current = current;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isCurrent() {
        return current;
    }

    public void setCurrent(boolean current) {
        this.current = current;
    }
}
