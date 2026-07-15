package com.tenalink.appointment.controller;

import com.tenalink.appointment.dto.AppointmentDto;
import com.tenalink.appointment.entity.AppointmentEntity;
import com.tenalink.appointment.service.AppointmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/appointments")
public class AppointmentController {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentController.class);

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<AppointmentEntity> create(
            @RequestBody AppointmentDto.CreateRequest req
    ) {
        return ResponseEntity.ok(service.create(req));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentEntity>> getByPatient(
            @PathVariable UUID patientId
    ) {
        return ResponseEntity.ok(service.getByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentEntity>> getByDoctor(
            @PathVariable UUID doctorId
    ) {
        logger.info("GET /appointments/doctor/{} — fetching appointments", doctorId);
        List<AppointmentEntity> appointments = service.getByDoctor(doctorId);
        logger.info(
                "GET /appointments/doctor/{} — returning {} appointment(s)",
                doctorId,
                appointments.size()
        );
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AppointmentEntity> updateStatus(
            @PathVariable UUID id,
            @RequestBody AppointmentDto.StatusUpdateRequest req
    ) {
        logger.info("PUT /appointments/{}/status — requested status={}", id, req != null ? req.getStatus() : null);
        AppointmentEntity updated = service.updateStatus(id, req != null ? req.getStatus() : null);
        logger.info("PUT /appointments/{}/status — success, new status={}", id, updated.getStatus());
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(
            @PathVariable UUID id
    ) {
        service.cancel(id);
        return ResponseEntity.ok().build();
    }
}
