package com.tenalink.medicalrecords.repository;
import com.tenalink.medicalrecords.entity.MedicalEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
public interface MedicalEventRepository extends JpaRepository<MedicalEventEntity, UUID> {
    List<MedicalEventEntity> findByPatientIdOrderByTimestampDesc(UUID patientId);
    List<MedicalEventEntity> findByPatientIdAndEventTypeOrderByTimestampDesc(UUID patientId, String eventType);
}
