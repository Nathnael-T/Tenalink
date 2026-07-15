package com.tenalink.user.repository;

import com.tenalink.user.entity.DoctorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface DoctorRepository extends JpaRepository<DoctorEntity, UUID> {
    Optional<DoctorEntity> findByUserId(UUID userId);
    java.util.List<DoctorEntity> findAllByOrderByCreatedAtDesc();
}
