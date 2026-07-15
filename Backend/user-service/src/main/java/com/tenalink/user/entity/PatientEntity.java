package com.tenalink.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PatientEntity {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID userId;

    @Column(nullable = false)
    private String faydaId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String dateOfBirth;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String contactPhone;

    private String bloodType;

    @Column(columnDefinition = "text")
    private String allergies;

    @Column(columnDefinition = "text")
    private String chronicConditions;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    @JdbcTypeCode(SqlTypes.VARBINARY)
    @Column(name = "id_document_data")
    private byte[] idDocumentData;

    @Column(name = "id_document_name")
    private String idDocumentName;

    @Column(name = "id_document_uploaded_at")
    private LocalDateTime idDocumentUploadedAt;
}