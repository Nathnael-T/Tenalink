package com.tenalink.pharmacy.dto;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;
public class PrescriptionDto {
    @Data public static class CreateRequest { private UUID patientId; private UUID doctorId; private String medication; private String dosage; private Instant prescribedAt; }
}
