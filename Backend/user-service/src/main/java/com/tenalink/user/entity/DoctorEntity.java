package com.tenalink.user.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "doctors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DoctorEntity {
    @Id private UUID id;
    @Column(nullable = false, unique = true) private UUID userId;
    @Column(nullable = false) private String fullName;
    @Column(nullable = false) private String specialization;
    @Column(nullable = false) private String contactPhone;
    @Column(nullable = false) private java.time.Instant createdAt = java.time.Instant.now();
}
