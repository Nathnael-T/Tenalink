package com.tenalink.user.service;

import com.tenalink.user.entity.DoctorEntity;
import com.tenalink.user.repository.DoctorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class DoctorService {
    private static final Logger logger = LoggerFactory.getLogger(DoctorService.class);
    private final DoctorRepository repo;

    public DoctorService(DoctorRepository repo) {
        this.repo = repo;
    }

    public List<DoctorEntity> getAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    public DoctorEntity get(UUID id) {
        logger.info("Resolving doctor by id {}", id);
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found for id: " + id));
    }

    public DoctorEntity getByUserId(UUID userId) {
        logger.info("Resolving doctor for userId {}", userId);
        return repo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found for userId: " + userId));
    }
}
