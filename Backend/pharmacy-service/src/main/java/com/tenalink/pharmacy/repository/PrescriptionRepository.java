package com.tenalink.pharmacy.repository;
import com.tenalink.pharmacy.entity.PrescriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
public interface PrescriptionRepository extends JpaRepository<PrescriptionEntity, UUID> {
    List<PrescriptionEntity> findByPatientIdOrderByPrescribedAtDesc(UUID patientId);
    List<PrescriptionEntity> findByDoctorIdOrderByPrescribedAtDesc(UUID doctorId);
}
