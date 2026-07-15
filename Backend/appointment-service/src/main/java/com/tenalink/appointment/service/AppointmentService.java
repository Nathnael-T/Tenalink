package com.tenalink.appointment.service;

import com.tenalink.appointment.dto.AppointmentDto;
import com.tenalink.appointment.entity.AppointmentEntity;
import com.tenalink.appointment.repository.AppointmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentService.class);

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "SCHEDULED",
            "ACCEPTED",
            "REJECTED",
            "RESCHEDULE_REQUESTED",
            "CANCELLED",
            "COMPLETED",
            "NO_SHOW"
    );

    private final AppointmentRepository repo;

    public AppointmentService(AppointmentRepository repo) {
        this.repo = repo;
    }

    public AppointmentEntity create(AppointmentDto.CreateRequest req) {
        if (req.getPatientId() == null) {
            throw new RuntimeException("patientId is required");
        }
        if (req.getDoctorId() == null) {
            throw new RuntimeException("doctorId is required");
        }
        if (req.getHospitalId() == null || req.getHospitalId().isBlank()) {
            throw new RuntimeException("hospitalId is required");
        }
        if (req.getDate() == null || req.getTime() == null) {
            throw new RuntimeException("Date and time are required");
        }

        AppointmentEntity entity = new AppointmentEntity();

        entity.setPatientId(req.getPatientId());
        entity.setDoctorId(req.getDoctorId());
        entity.setHospitalId(req.getHospitalId().trim());

        entity.setPatientName(req.getPatientName());
        entity.setDoctorName(req.getDoctorName());
        entity.setHospitalName(req.getHospitalName());
        entity.setReason(req.getReason());

        LocalDate date = LocalDate.parse(req.getDate());
        LocalTime time = LocalTime.parse(req.getTime());

        entity.setScheduledAt(
            ZonedDateTime.of(date, time, ZoneId.systemDefault()).toInstant()
        );

        entity.setDate(req.getDate());
        entity.setTime(req.getTime());
        entity.setStatus("SCHEDULED");
        entity.setCreatedAt(Instant.now());

        AppointmentEntity saved = repo.save(entity);
        logger.info(
                "Created appointment {} for doctorId={} patientId={} status={}",
                saved.getId(),
                saved.getDoctorId(),
                saved.getPatientId(),
                saved.getStatus()
        );
        return saved;
    }

    public List<AppointmentEntity> getByPatient(UUID patientId) {
        return repo.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public List<AppointmentEntity> getByDoctor(UUID doctorId) {
        List<AppointmentEntity> results = repo.findByDoctorIdOrderByCreatedAtDesc(doctorId);
        logger.info("Found {} appointments for doctorId={}", results.size(), doctorId);
        return results;
    }

    public AppointmentEntity updateStatus(UUID id, String status) {
        if (status == null || status.isBlank()) {
            throw new RuntimeException("status is required");
        }

        String normalized = status.trim().toUpperCase();
        if (!ALLOWED_STATUSES.contains(normalized)) {
            throw new RuntimeException("Invalid status: " + status);
        }

        AppointmentEntity appointment = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        String previous = appointment.getStatus();
        appointment.setStatus(normalized);
        AppointmentEntity saved = repo.save(appointment);

        logger.info(
                "Updated appointment {} status: {} -> {}",
                id,
                previous,
                normalized
        );
        return saved;
    }

    public void cancel(UUID id) {
        updateStatus(id, "CANCELLED");
    }

    public Page<AppointmentEntity> getAllPaginated(Pageable pageable) {
        return repo.findAll(pageable);
    }

    public long count() {
        return repo.count();
    }

    public long countByStatus(String status) {
        return repo.countByStatus(status);
    }
}
