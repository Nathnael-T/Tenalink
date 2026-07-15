package com.tenalink.user.controller;

import com.tenalink.user.entity.DoctorEntity;
import com.tenalink.user.service.DoctorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doctors")
public class DoctorController {
    private static final Logger logger = LoggerFactory.getLogger(DoctorController.class);
    private final DoctorService service;

    public DoctorController(DoctorService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<DoctorEntity>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorEntity> get(@PathVariable UUID id) {
        DoctorEntity doctor;
        try {
            doctor = service.get(id);
        } catch (Exception e) {
            logger.info("Doctor not found by id {}, trying userId lookup", id);
            doctor = service.getByUserId(id);
        }
        return ResponseEntity.ok(doctor);
    }
}
