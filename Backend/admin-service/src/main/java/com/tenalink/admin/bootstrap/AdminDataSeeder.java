package com.tenalink.admin.bootstrap;

import com.tenalink.admin.entity.AuditLogEntity;
import com.tenalink.admin.entity.SystemConfigEntity;
import com.tenalink.admin.repository.AuditLogRepository;
import com.tenalink.admin.repository.SystemConfigRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class AdminDataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminDataSeeder.class);
    private final AuditLogRepository auditLogRepo;
    private final SystemConfigRepository configRepo;

    public AdminDataSeeder(AuditLogRepository auditLogRepo, SystemConfigRepository configRepo) {
        this.auditLogRepo = auditLogRepo;
        this.configRepo = configRepo;
    }

    @Override
    public void run(String... args) {
        logger.info("Seeding admin data...");
        seedAuditLogs();
        seedSystemConfig();
        logger.info("Admin data seeding complete.");
    }

    private void seedAuditLogs() {
        UUID adminId = UUID.randomUUID(); // Use a random admin ID for demo
        createAuditIfMissing(adminId, "USER_CREATED", "users", "Sarah Johnson", "ROLE_ADMIN", Instant.now().minus(7, ChronoUnit.DAYS));
        createAuditIfMissing(adminId, "USER_CREATED", "users", "Sarah Johnson", "ROLE_ADMIN", Instant.now().minus(6, ChronoUnit.DAYS));
        createAuditIfMissing(adminId, "APPOINTMENT_CREATED", "appointments", "System", "ROLE_SYSTEM", Instant.now().minus(5, ChronoUnit.DAYS));
        createAuditIfMissing(adminId, "PRESCRIPTION_CREATED", "prescriptions", "Dr. Emily Carter", "ROLE_PROVIDER", Instant.now().minus(4, ChronoUnit.DAYS));
        createAuditIfMissing(adminId, "CONFIG_UPDATED", "system_config", "Michael Chen", "ROLE_ADMIN", Instant.now().minus(3, ChronoUnit.DAYS));
        createAuditIfMissing(adminId, "HOSPITAL_UPDATED", "hospitals", "Sarah Johnson", "ROLE_ADMIN", Instant.now().minus(2, ChronoUnit.DAYS));
        createAuditIfMissing(adminId, "USER_LOGIN", "auth", "John Smith", "ROLE_PATIENT", Instant.now().minus(1, ChronoUnit.DAYS));
        createAuditIfMissing(adminId, "USER_LOGIN", "auth", "Dr. James Wilson", "ROLE_PROVIDER", Instant.now().minus(1, ChronoUnit.HOURS));
    }

    private void createAuditIfMissing(UUID adminId, String action, String target, String actorName, String role, Instant timestamp) {
        AuditLogEntity log = new AuditLogEntity();
        log.setAdminId(adminId);
        log.setAction(action);
        log.setTargetResource(target);
        log.setActorName(actorName);
        log.setRole(role);
        log.setTimestamp(timestamp);
        auditLogRepo.save(log);
        logger.info("Seeded audit log: {}", action);
    }

    private void seedSystemConfig() {
        createConfigIfMissing("platform.name", "TenaLink Health Platform", "Platform display name");
        createConfigIfMissing("platform.max-upload-size", "10485760", "Max file upload size in bytes (10MB)");
        createConfigIfMissing("platform.maintenance-mode", "false", "Whether the platform is in maintenance mode");
        createConfigIfMissing("platform.registration-enabled", "true", "Whether new user registration is enabled");
        createConfigIfMissing("platform.appointment-booking-enabled", "true", "Whether patients can book appointments");
        createConfigIfMissing("platform.notification-email-enabled", "false", "Whether email notifications are sent");
        createConfigIfMissing("platform.default-timezone", "Africa/Addis_Ababa", "Default timezone for the platform");
        createConfigIfMissing("platform.support-email", "support@tenalink.com", "Platform support contact email");
    }

    private void createConfigIfMissing(String key, String value, String description) {
        if (configRepo.findByConfigKey(key).isPresent()) return;
        SystemConfigEntity config = new SystemConfigEntity();
        config.setId(UUID.randomUUID().toString());
        config.setConfigKey(key);
        config.setConfigValue(value);
        config.setDescription(description);
        configRepo.save(config);
        logger.info("Seeded config: {}", key);
    }
}
