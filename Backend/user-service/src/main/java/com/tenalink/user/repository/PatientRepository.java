package com.tenalink.user.repository;
import com.tenalink.user.entity.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;
public interface PatientRepository extends JpaRepository<PatientEntity, UUID> {
    Optional<PatientEntity> findByFaydaId(String faydaId);
    Optional<PatientEntity> findByUserId(UUID userId);
    java.util.List<PatientEntity> findAllByOrderByCreatedAtDesc();
}
