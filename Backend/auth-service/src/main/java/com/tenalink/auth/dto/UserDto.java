package com.tenalink.auth.dto;

import lombok.Data;
import java.time.Instant;
import java.util.Map;

public class UserDto {

    @Data
    public static class Response {
        private String id;
        private String email;
        private String faydaId;
        private String fullName;
        private String role;
        private Instant createdAt;
    }

    @Data
    public static class StatsResponse {
        private long totalUsers;
        private long patients;
        private long doctors;
        private long admins;
        private long superAdmins;
    }
}
