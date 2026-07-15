package com.tenalink.auth.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;
@Entity @Table(name = "users", indexes = {
    @Index(name = "idx_user_role", columnList = "role")
}) @Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UserEntity {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false, unique = true) private String email;
    @Column(unique = true) private String faydaId;
    @Column(nullable = false) private String passwordHash;
    @Column(nullable = false) private String fullName;
    @Column(nullable = false) private String role;
    @Column(nullable = false) private Instant createdAt = Instant.now();
}
