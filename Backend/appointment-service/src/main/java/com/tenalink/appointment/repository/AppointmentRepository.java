package com.tenalink.appointment.repository;
import com.tenalink.appointment.entity.AppointmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, UUID> {
    List<AppointmentEntity> findByPatientIdOrderByScheduledAtDesc(UUID patientId);
    List<AppointmentEntity> findByDoctorIdOrderByScheduledAtDesc(UUID doctorId);
    List<AppointmentEntity> findByPatientIdOrderByCreatedAtDesc(UUID patientId);
    List<AppointmentEntity> findByDoctorIdOrderByCreatedAtDesc(UUID doctorId);
    long countByStatus(String status);
}
