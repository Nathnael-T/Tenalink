package com.tenalink.pharmacy.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;
@Entity @Table(name = "prescriptions") @Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PrescriptionEntity {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false) private UUID patientId;
    @Column(nullable = false) private UUID doctorId;
    @Column(nullable = false) private String medication;
    @Column(nullable = false) private String dosage;
    @Column(nullable = false) private Instant prescribedAt;
    @Column(nullable = false) private String status;
}
