package com.tenalink.appointment.dto;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class AppointmentDto {

    private UUID patientId;
    private UUID doctorId;
    private String hospitalId;

    private String patientName;
    private String doctorName;
    private String hospitalName;

    private String reason;
    private String date;
    private String time;

    private String status;

    @Data
    public static class CreateRequest {
        private UUID patientId;
        private UUID doctorId;
        private String hospitalId;
        private String patientName;
        private String doctorName;
        private String hospitalName;
        private String reason;
        private String date;
        private String time;
    }

    @Data
    public static class StatusUpdateRequest {
        private String status;
    }

    @Data
    public static class OverviewResponse {
        private long totalAppointments;
        private long scheduled;
        private long completed;
        private long cancelled;
        private long noShow;
    }
}