package com.tenalink.user.service;

import com.tenalink.user.dto.PatientDto;
import com.tenalink.user.entity.PatientEntity;
import com.tenalink.user.exception.PatientNotFoundException;
import com.tenalink.user.repository.PatientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PatientService {

    private static final Logger logger = LoggerFactory.getLogger(PatientService.class);
    private static final String UPLOAD_DIR = "uploads/patients/";

    private final PatientRepository repo;

    public PatientService(PatientRepository repo) {
        this.repo = repo;
    }

    public PatientEntity upsert(UUID id, PatientDto.UpsertRequest req, MultipartFile file) {

        PatientEntity p = repo.findById(id).orElse(new PatientEntity());

        p.setId(id);
        p.setFaydaId(req.getFaydaId());
        p.setFullName(req.getFullName());
        p.setDateOfBirth(req.getDateOfBirth());
        p.setGender(req.getGender());
        p.setContactPhone(req.getContactPhone());
        p.setBloodType(req.getBloodType());
        p.setAllergies(req.getAllergies());
        p.setChronicConditions(req.getChronicConditions());

        // =========================
        // FILE HANDLING (BYTEA FIX)
        // =========================
        if (file != null && !file.isEmpty()) {
            try {
                File dir = new File(UPLOAD_DIR);
                if (!dir.exists()) dir.mkdirs();

                String originalName = file.getOriginalFilename();

                String extension = "";
                if (originalName != null && originalName.contains(".")) {
                    extension = originalName.substring(originalName.lastIndexOf("."));
                }

                String storedFileName = UUID.randomUUID() + extension;
                Path filePath = Paths.get(UPLOAD_DIR, storedFileName);

                byte[] fileBytes = file.getBytes();
                Files.write(filePath, fileBytes);

                // ✅ FIXED: store in BYTEA field
                p.setIdDocumentData(fileBytes);
                p.setIdDocumentName(originalName);
                p.setIdDocumentUploadedAt(LocalDateTime.now());

            } catch (IOException e) {
                logger.error("Failed to store ID document", e);
                throw new RuntimeException("File upload failed");
            }
        }

        return repo.save(p);
    }

    public PatientEntity upsertFromJson(UUID userId, PatientDto.UpsertRequest req) {
        logger.info("Upserting patient profile from JSON for userId: {}", userId);
        
        // Try to find patient by userId first (normal case)
        PatientEntity p = repo.findByUserId(userId).orElse(null);
        
        if (p == null) {
            // Patient not found, create new one
            logger.info("Patient not found for userId {}, creating new patient", userId);
            p = new PatientEntity();
            p.setId(UUID.randomUUID());
            p.setUserId(userId);
            p.setCreatedAt(java.time.Instant.now());
        } else {
            logger.info("Found existing patient for userId {}", userId);
        }

        // Update patient fields from request with defaults for required fields
        
        // faydaId: required
        if (req.getFaydaId() != null && !req.getFaydaId().isBlank()) {
            p.setFaydaId(req.getFaydaId());
        } else if (p.getFaydaId() == null) {
            p.setFaydaId("UNKNOWN");
        }
        
        // fullName: required - use provided value or default
        if (req.getFullName() != null && !req.getFullName().isBlank()) {
            p.setFullName(req.getFullName());
        } else if (p.getFullName() == null) {
            p.setFullName("Patient");
        }
        
        // dateOfBirth: required - use provided value or default
        if (req.getDateOfBirth() != null && !req.getDateOfBirth().isBlank()) {
            p.setDateOfBirth(req.getDateOfBirth());
        } else if (p.getDateOfBirth() == null) {
            p.setDateOfBirth("2000-01-01");
        }
        
        // gender: required - use provided value or default
        if (req.getGender() != null && !req.getGender().isBlank()) {
            p.setGender(req.getGender());
        } else if (p.getGender() == null) {
            p.setGender("UNKNOWN");
        }
        
        // contactPhone: required - use provided value or default
        if (req.getContactPhone() != null && !req.getContactPhone().isBlank()) {
            p.setContactPhone(req.getContactPhone());
        } else if (p.getContactPhone() == null) {
            p.setContactPhone("+000000000");
        }
        
        // Optional fields - only update if provided
        if (req.getBloodType() != null && !req.getBloodType().isBlank()) {
            p.setBloodType(req.getBloodType());
        }
        
        if (req.getAllergies() != null && !req.getAllergies().isBlank()) {
            p.setAllergies(req.getAllergies());
        }
        
        if (req.getChronicConditions() != null && !req.getChronicConditions().isBlank()) {
            p.setChronicConditions(req.getChronicConditions());
        }

        return repo.save(p);
    }

    public PatientEntity get(UUID id) {
        logger.info("Resolving patient by id {}", id);

        return repo.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Patient not found for id {}", id);
                    return new PatientNotFoundException("Patient not found for id: " + id);
                });
    }

    public PatientEntity getByUserId(UUID userId) {
        logger.info("Resolving patient for userId {}", userId);

        return repo.findByUserId(userId)
                .orElseThrow(() -> {
                    logger.warn("Patient not found for userId {}", userId);
                    return new PatientNotFoundException("Patient not found for userId: " + userId);
                });
    }
}