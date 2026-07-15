package com.tenalink.medicalrecords.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;
@Entity @Table(name = "medical_events") @Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MedicalEventEntity {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false) private UUID patientId;
    @Column(nullable = true)  private UUID hospitalId;   // optional – event may not be tied to a specific hospital
    @Column(nullable = false) private UUID authorId;
    @Column(nullable = false) private Instant timestamp;
    @Column(nullable = false) private String eventType;
    @Column(nullable = false, columnDefinition = "text") private String eventData;
}
