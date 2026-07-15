package com.tenalink.admin.repository;
import com.tenalink.admin.entity.AuditLogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLogEntity, UUID> {
    List<AuditLogEntity> findByAdminIdOrderByTimestampDesc(UUID adminId);
    List<AuditLogEntity> findAllByOrderByTimestampDesc();
    Page<AuditLogEntity> findAllByOrderByTimestampDesc(Pageable pageable);
}
