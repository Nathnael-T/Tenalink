package com.tenalink.medicalrecords.dto;
import lombok.Data;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
public class MedicalEventDto {
    @Data public static class CreateRequest { private UUID patientId; private UUID hospitalId; private UUID authorId; private Instant timestamp; private String eventType; private String eventData; }

    @Data
    public static class TimelineResponse {
        private UUID id;
        private String type;
        private String eventType;
        private Instant occurredAt;
        private String title;
        private String summary;
        private String facility;
        private String clinician;
        private List<String> details;
        private List<String> tags;
        private String referenceId;
        private List<MetadataItem> metadata;
        private List<String> notes;
    }

    @Data
    public static class MetadataItem {
        private String label;
        private String value;
    }
}
