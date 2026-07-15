package com.tenalink.admin.dto;

import lombok.Data;

public class SystemConfigDto {

    @Data
    public static class CreateRequest {
        private String configKey;
        private String configValue;
        private String description;
    }

    @Data
    public static class UpdateRequest {
        private String configValue;
        private String description;
    }

    @Data
    public static class Response {
        private String id;
        private String configKey;
        private String configValue;
        private String description;
        private String updatedAt;
    }
}
