package com.tenalink.pharmacy.controller;
import com.tenalink.pharmacy.dto.PrescriptionDto;
import com.tenalink.pharmacy.entity.PrescriptionEntity;
import com.tenalink.pharmacy.service.PrescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
@RestController @RequestMapping("/api/v1/prescriptions")
public class PrescriptionController {
    private final PrescriptionService service;
    public PrescriptionController(PrescriptionService service) { this.service = service; }
    @PostMapping public ResponseEntity<PrescriptionEntity> create(@RequestBody PrescriptionDto.CreateRequest req) { return ResponseEntity.ok(service.create(req)); }
    @GetMapping("/patient/{patientId}") public ResponseEntity<List<PrescriptionEntity>> getByPatient(@PathVariable UUID patientId) { return ResponseEntity.ok(service.getByPatient(patientId)); }
    @GetMapping("/doctor/{doctorId}") public ResponseEntity<List<PrescriptionEntity>> getByDoctor(@PathVariable UUID doctorId) { return ResponseEntity.ok(service.getByDoctor(doctorId)); }
    @PutMapping("/{id}/fulfill") public ResponseEntity<Void> fulfill(@PathVariable UUID id) { service.fulfill(id); return ResponseEntity.ok().build(); }
}
