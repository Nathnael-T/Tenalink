package com.tenalink.appointment.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private java.util.UUID id;

    @Column(nullable = false)
    private java.util.UUID patientId;

    @Column(nullable = false)
    private java.util.UUID doctorId;

    @Column(nullable = false)
    private String hospitalId;

    @Column(nullable = false)
    private Instant scheduledAt;

    @Column(nullable = false)
    private String status;

    private String patientName;
    private String doctorName;
    private String hospitalName;
    private String reason;

    private String date;
    private String time;

    @Column(nullable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}