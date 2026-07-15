package com.tenalink.medicalrecords.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenalink.medicalrecords.dto.MedicalEventDto;
import com.tenalink.medicalrecords.entity.MedicalEventEntity;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class MedicalEventMapper {

    private static final Map<String, String> DISPLAY_TYPES = Map.ofEntries(
            Map.entry("VISIT_CREATED", "Visit Created"),
            Map.entry("DIAGNOSIS", "Diagnosis Added"),
            Map.entry("DIAGNOSIS_ADDED", "Diagnosis Added"),
            Map.entry("PRESCRIPTION", "Prescription Issued"),
            Map.entry("PRESCRIPTION_ISSUED", "Prescription Issued"),
            Map.entry("LAB_RESULT", "Lab Result Uploaded"),
            Map.entry("LAB_RESULT_UPLOADED", "Lab Result Uploaded"),
            Map.entry("DOCUMENT", "Doctor Note Added"),
            Map.entry("DOCTOR_NOTE_ADDED", "Doctor Note Added"),
            Map.entry("VITALS", "Vitals Recorded"),
            Map.entry("ALLERGY", "Allergy Recorded")
    );

    private final JdbcTemplate userDbJdbcTemplate;
    private final ObjectMapper objectMapper;

    public MedicalEventMapper(
            @Qualifier("userDbJdbcTemplate") JdbcTemplate userDbJdbcTemplate,
            ObjectMapper objectMapper) {
        this.userDbJdbcTemplate = userDbJdbcTemplate;
        this.objectMapper = objectMapper;
    }

    public MedicalEventDto.TimelineResponse toTimelineResponse(MedicalEventEntity entity) {
        Map<String, Object> data = parseEventData(entity.getEventData());
        String displayType = toDisplayType(entity.getEventType());

        MedicalEventDto.TimelineResponse response = new MedicalEventDto.TimelineResponse();
        response.setId(entity.getId());
        response.setEventType(entity.getEventType());
        response.setType(displayType);
        response.setOccurredAt(entity.getTimestamp());
        response.setTitle(resolveTitle(entity.getEventType(), data, displayType));
        response.setSummary(resolveSummary(entity.getEventType(), data));
        response.setFacility(resolveFacility(data, entity.getHospitalId()));
        response.setClinician(resolveClinician(entity.getAuthorId()));
        response.setDetails(resolveDetails(entity.getEventType(), data));
        response.setTags(resolveTags(entity.getEventType(), data));
        response.setReferenceId("EVT-" + entity.getId().toString().substring(0, 8).toUpperCase());
        response.setMetadata(resolveMetadata(entity.getEventType(), data));
        response.setNotes(resolveNotes(data));
        return response;
    }

    private Map<String, Object> parseEventData(String eventData) {
        if (eventData == null || eventData.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(eventData, new TypeReference<Map<String, Object>>() {});
        } catch (Exception ignored) {
            return Map.of("summary", eventData);
        }
    }

    private String toDisplayType(String eventType) {
        if (eventType == null || eventType.isBlank()) {
            return "Medical Event";
        }
        String normalized = eventType.trim().toUpperCase();
        return DISPLAY_TYPES.getOrDefault(normalized, humanizeEventType(normalized));
    }

    private String humanizeEventType(String eventType) {
        String[] parts = eventType.toLowerCase().split("_");
        StringBuilder builder = new StringBuilder();
        for (String part : parts) {
            if (part.isEmpty()) {
                continue;
            }
            if (!builder.isEmpty()) {
                builder.append(' ');
            }
            builder.append(Character.toUpperCase(part.charAt(0))).append(part.substring(1));
        }
        return builder.isEmpty() ? "Medical Event" : builder.toString();
    }

    private String resolveTitle(String eventType, Map<String, Object> data, String displayType) {
        String title = asString(data.get("title"));
        if (title != null) {
            return title;
        }

        return switch (normalize(eventType)) {
            case "DIAGNOSIS", "DIAGNOSIS_ADDED" -> firstNonBlank(asString(data.get("condition")), displayType);
            case "LAB_RESULT", "LAB_RESULT_UPLOADED" -> {
                String test = asString(data.get("test"));
                yield test != null ? test + " result recorded" : displayType;
            }
            case "PRESCRIPTION", "PRESCRIPTION_ISSUED" -> {
                String medication = asString(data.get("medication"));
                yield medication != null ? medication + " prescription recorded" : displayType;
            }
            case "DOCUMENT", "DOCTOR_NOTE_ADDED" -> firstNonBlank(asString(data.get("summary")), displayType);
            case "VITALS" -> "Vitals recorded";
            case "ALLERGY" -> {
                String allergen = asString(data.get("allergen"));
                yield allergen != null ? "Allergy: " + allergen : displayType;
            }
            case "VISIT_CREATED" -> firstNonBlank(asString(data.get("title")), displayType);
            default -> displayType;
        };
    }

    private String resolveSummary(String eventType, Map<String, Object> data) {
        String summary = firstNonBlank(
                asString(data.get("summary")),
                asString(data.get("notes")),
                asString(data.get("result")),
                asString(data.get("instructions"))
        );
        if (summary != null) {
            return summary;
        }

        return switch (normalize(eventType)) {
            case "DIAGNOSIS", "DIAGNOSIS_ADDED" -> firstNonBlank(asString(data.get("notes")), "Diagnosis recorded in patient chart.");
            case "LAB_RESULT", "LAB_RESULT_UPLOADED" -> "Laboratory result uploaded to the patient record.";
            case "PRESCRIPTION", "PRESCRIPTION_ISSUED" -> {
                String dosage = asString(data.get("dosage"));
                yield dosage != null ? "Dosage: " + dosage : "Prescription recorded in patient chart.";
            }
            case "VITALS" -> "Patient vitals captured during clinical review.";
            case "ALLERGY" -> {
                String severity = asString(data.get("severity"));
                yield severity != null ? "Severity: " + severity : "Allergy recorded in patient chart.";
            }
            case "VISIT_CREATED" -> "Clinical visit recorded in patient timeline.";
            case "DOCUMENT", "DOCTOR_NOTE_ADDED" -> "Clinical note added to patient timeline.";
            default -> "Medical event recorded in patient timeline.";
        };
    }

    private String resolveFacility(Map<String, Object> data, UUID hospitalId) {
        String facility = asString(data.get("facility"));
        if (facility != null) {
            return facility;
        }
        if (hospitalId != null) {
            return "Hospital " + hospitalId.toString().substring(0, 8);
        }
        return "Care facility";
    }

    private String resolveClinician(UUID authorId) {
        if (authorId == null) {
            return "Clinical staff";
        }
        try {
            List<String> names = userDbJdbcTemplate.query(
                    "SELECT full_name FROM doctors WHERE id = ?",
                    (rs, rowNum) -> rs.getString("full_name"),
                    authorId
            );
            if (!names.isEmpty() && names.get(0) != null && !names.get(0).isBlank()) {
                return names.get(0);
            }
        } catch (Exception ignored) {
            // user_db may be unavailable during local development
        }
        return "Clinical staff";
    }

    private List<String> resolveDetails(String eventType, Map<String, Object> data) {
        List<String> details = new ArrayList<>();
        switch (normalize(eventType)) {
            case "DIAGNOSIS", "DIAGNOSIS_ADDED" -> {
                addDetail(details, "Condition", asString(data.get("condition")));
                addDetail(details, "Notes", asString(data.get("notes")));
                addDetail(details, "Primary diagnosis", asString(data.get("primaryDiagnosis")));
            }
            case "LAB_RESULT", "LAB_RESULT_UPLOADED" -> {
                addDetail(details, "Test", asString(data.get("test")));
                addDetail(details, "Result", asString(data.get("result")));
                addDetail(details, "Lab", asString(data.get("lab")));
            }
            case "PRESCRIPTION", "PRESCRIPTION_ISSUED" -> {
                addDetail(details, "Medication", asString(data.get("medication")));
                addDetail(details, "Dosage", asString(data.get("dosage")));
                addDetail(details, "Instructions", asString(data.get("instructions")));
            }
            case "VITALS" -> {
                Object vitals = data.get("vitals");
                if (vitals instanceof Map<?, ?> vitalsMap) {
                    vitalsMap.forEach((key, value) -> addDetail(details, String.valueOf(key), asString(value)));
                }
            }
            case "ALLERGY" -> {
                addDetail(details, "Allergen", asString(data.get("allergen")));
                addDetail(details, "Severity", asString(data.get("severity")));
            }
            case "VISIT_CREATED" -> {
                addDetail(details, "Priority", asString(data.get("priority")));
                addDetail(details, "Facility", asString(data.get("facility")));
            }
            case "DOCUMENT", "DOCTOR_NOTE_ADDED" -> {
                addDetail(details, "Summary", asString(data.get("summary")));
                addDetail(details, "Follow-up", asString(data.get("followUp")));
            }
            default -> data.forEach((key, value) -> {
                if (value != null && !(value instanceof Map<?, ?>)) {
                    addDetail(details, humanizeEventType(String.valueOf(key)), asString(value));
                }
            });
        }
        return details;
    }

    private List<String> resolveTags(String eventType, Map<String, Object> data) {
        List<String> tags = new ArrayList<>();
        String displayType = toDisplayType(eventType);
        tags.add(displayType);
        String priority = asString(data.get("priority"));
        if (priority != null) {
            tags.add(priority);
        }
        return tags;
    }

    private List<MedicalEventDto.MetadataItem> resolveMetadata(String eventType, Map<String, Object> data) {
        List<MedicalEventDto.MetadataItem> metadata = new ArrayList<>();
        for (Map.Entry<String, String> entry : metadataFieldsFor(eventType, data).entrySet()) {
            MedicalEventDto.MetadataItem item = new MedicalEventDto.MetadataItem();
            item.setLabel(entry.getKey());
            item.setValue(entry.getValue());
            metadata.add(item);
        }
        return metadata;
    }

    private Map<String, String> metadataFieldsFor(String eventType, Map<String, Object> data) {
        Map<String, String> fields = new LinkedHashMap<>();
        switch (normalize(eventType)) {
            case "DIAGNOSIS", "DIAGNOSIS_ADDED" -> {
                putIfPresent(fields, "Diagnosis", asString(data.get("condition")));
                putIfPresent(fields, "Notes", asString(data.get("notes")));
            }
            case "LAB_RESULT", "LAB_RESULT_UPLOADED" -> {
                putIfPresent(fields, "Test", asString(data.get("test")));
                putIfPresent(fields, "Result", asString(data.get("result")));
            }
            case "PRESCRIPTION", "PRESCRIPTION_ISSUED" -> {
                putIfPresent(fields, "Medication", asString(data.get("medication")));
                putIfPresent(fields, "Dosage", asString(data.get("dosage")));
            }
            case "ALLERGY" -> {
                putIfPresent(fields, "Allergen", asString(data.get("allergen")));
                putIfPresent(fields, "Severity", asString(data.get("severity")));
            }
            default -> data.forEach((key, value) -> {
                if (value != null && !(value instanceof Map<?, ?>)) {
                    putIfPresent(fields, humanizeEventType(String.valueOf(key)), asString(value));
                }
            });
        }
        return fields;
    }

    private List<String> resolveNotes(Map<String, Object> data) {
        List<String> notes = new ArrayList<>();
        String notesValue = asString(data.get("notes"));
        if (notesValue != null) {
            notes.add(notesValue);
        }
        String followUp = asString(data.get("followUp"));
        if (followUp != null) {
            notes.add(followUp);
        }
        return notes;
    }

    private void addDetail(List<String> details, String label, String value) {
        if (value != null && !value.isBlank()) {
            details.add(label + ": " + value);
        }
    }

    private void putIfPresent(Map<String, String> fields, String label, String value) {
        if (value != null && !value.isBlank()) {
            fields.put(label, value);
        }
    }

    private String normalize(String eventType) {
        return eventType == null ? "" : eventType.trim().toUpperCase();
    }

    private String asString(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }
}
