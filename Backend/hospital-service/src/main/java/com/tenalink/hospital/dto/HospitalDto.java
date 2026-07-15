package com.tenalink.hospital.dto;

import lombok.Data;

public class HospitalDto {

    @Data
    public static class CreateRequest {
        private String name;
        private String specialty;
        private Integer waitTime;
        private String address;
        private String contact;
        private Double latitude;
        private Double longitude;
        private boolean icuAvailable;
        private boolean labAvailable;
        private boolean pharmacyAvailable;
        private boolean radiologyAvailable;
        private boolean ambulanceAccess;
        private boolean glucoseAvailable;
    }

    @Data
    public static class UpdateRequest {
        private String name;
        private String specialty;
        private Integer waitTime;
        private String address;
        private String contact;
        private Double latitude;
        private Double longitude;
        private Boolean icuAvailable;
        private Boolean labAvailable;
        private Boolean pharmacyAvailable;
        private Boolean radiologyAvailable;
        private Boolean ambulanceAccess;
        private Boolean glucoseAvailable;
    }

    @Data
    public static class Response {
        private String id;
        private String name;
        private String specialty;
        private Integer waitTime;
        private String address;
        private String contact;
        private Double latitude;
        private Double longitude;
        private boolean icuAvailable;
        private boolean labAvailable;
        private boolean pharmacyAvailable;
        private boolean radiologyAvailable;
        private boolean ambulanceAccess;
        private boolean glucoseAvailable;
    }
}
