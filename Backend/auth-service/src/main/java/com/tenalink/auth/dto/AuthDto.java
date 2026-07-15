package com.tenalink.auth.dto;

import lombok.Data;

public class AuthDto {

    @Data
    public static class LoginRequest {
        private String identifier; // email OR Fayda ID
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String email;
        private String faydaId;
        private String password;
        private String fullName;
        private String role;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String userId;
        private String role;
    }
}