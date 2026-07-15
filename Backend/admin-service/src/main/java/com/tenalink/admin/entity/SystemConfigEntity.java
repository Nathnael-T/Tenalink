package com.tenalink.admin.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "system_config")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SystemConfigEntity {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String configKey;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String configValue;

    private String description;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void prePersistUpdate() {
        updatedAt = Instant.now();
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }
}
