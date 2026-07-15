package com.tenalink.auth.dto;

import lombok.Data;

public class ContextDto {

    @Data
    public static class IdentityContext {
        private String userId;
        private String role;
        private String patientId;
        private String doctorId;
        private String adminId;
    }
}
