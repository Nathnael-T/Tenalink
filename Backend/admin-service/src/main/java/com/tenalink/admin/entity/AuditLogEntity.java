package com.tenalink.admin.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;
@Entity @Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_timestamp", columnList = "timestamp")
}) @Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AuditLogEntity {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false) private UUID adminId;
    @Column(nullable = false) private String action;
    @Column(nullable = false) private String targetResource;
    @Column(nullable = false) private Instant timestamp = Instant.now();
    private String actorName;
    private String role;
}
