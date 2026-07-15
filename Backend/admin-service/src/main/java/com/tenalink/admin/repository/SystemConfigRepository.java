package com.tenalink.admin.repository;

import com.tenalink.admin.entity.SystemConfigEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SystemConfigRepository extends JpaRepository<SystemConfigEntity, String> {
    Optional<SystemConfigEntity> findByConfigKey(String configKey);
    boolean existsByConfigKey(String configKey);
}
