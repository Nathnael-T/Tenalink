package com.tenalink.hospital.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "hospitals", indexes = {
    @Index(name = "idx_hospital_specialty", columnList = "specialty")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class HospitalEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String specialty;

    private Integer waitTime;

    private String address;

    private String contact;

    private Double latitude;

    private Double longitude;

    @Column(nullable = false)
    private boolean icuAvailable;

    @Column(nullable = false)
    private boolean labAvailable;

    @Column(nullable = false)
    private boolean pharmacyAvailable;

    @Column(nullable = false)
    private boolean radiologyAvailable;

    @Column(nullable = false)
    private boolean ambulanceAccess;

    private boolean glucoseAvailable;

    @Column(nullable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
