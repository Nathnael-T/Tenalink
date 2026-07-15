package com.tenalink.admin.dto;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

public class AuditLogDto {
    @Data public static class CreateRequest {
        private UUID adminId;
        private String action;
        private String targetResource;
        private String actorName;
        private String role;
    }

    @Data public static class Response {
        private String id;
        private String adminId;
        private String action;
        private String targetResource;
        private Instant timestamp;
        private String actorName;
        private String role;
    }
}
