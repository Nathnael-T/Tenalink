package com.tenalink.medicalrecords.controller;

import com.tenalink.medicalrecords.dto.MedicalEventDto;
import com.tenalink.medicalrecords.service.MedicalEventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/records")
public class MedicalEventController {
    private final MedicalEventService service;

    public MedicalEventController(MedicalEventService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MedicalEventDto.TimelineResponse> create(@RequestBody MedicalEventDto.CreateRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @GetMapping("/patient/{patientId}/timeline")
    public ResponseEntity<List<MedicalEventDto.TimelineResponse>> getTimeline(@PathVariable UUID patientId) {
        return ResponseEntity.ok(service.getTimeline(patientId));
    }

    @GetMapping("/patient/{patientId}/documents")
    public ResponseEntity<List<MedicalEventDto.TimelineResponse>> getDocuments(@PathVariable UUID patientId) {
        return ResponseEntity.ok(service.getDocuments(patientId));
    }
}
