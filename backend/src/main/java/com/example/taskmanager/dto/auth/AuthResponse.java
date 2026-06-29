package com.example.taskmanager.dto.auth;

public record AuthResponse(
        String token,
        String tokenType,
        Long userId,
        String username,
        String email,
        String role
) {
}
