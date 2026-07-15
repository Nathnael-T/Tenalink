package com.tenalink.hospital.repository;

import com.tenalink.hospital.entity.HospitalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HospitalRepository extends JpaRepository<HospitalEntity, String> {
    List<HospitalEntity> findBySpecialtyIgnoreCaseOrderByCreatedAtDesc(String specialty);
    List<HospitalEntity> findByNameContainingIgnoreCaseOrderByCreatedAtDesc(String name);
    List<HospitalEntity> findAllByOrderByCreatedAtDesc();
}
