package com.tenalink.auth.bootstrap;

import com.tenalink.auth.entity.UserEntity;
import com.tenalink.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class UserDataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(UserDataSeeder.class);

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JdbcTemplate userDbJdbcTemplate;

    public UserDataSeeder(UserRepository userRepository,
                          BCryptPasswordEncoder passwordEncoder,
                          @Qualifier("userDbJdbcTemplate") JdbcTemplate userDbJdbcTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDbJdbcTemplate = userDbJdbcTemplate;
    }

    @Override
    public void run(String... args) {
        logger.info("Starting Auth user data seeding...");

        createAdminIfMissing("super@tenalink.com", "super123", "ROLE_SUPER_ADMIN", "Super Administrator");

        createAdminIfMissing("admin1@tenalink.com", "admin123", "ROLE_ADMIN", "Sarah Johnson");
        createAdminIfMissing("admin2@tenalink.com", "admin123", "ROLE_ADMIN", "Michael Chen");

        createProviderIfMissing("doctor1@tenalink.com", "doctor123", "ROLE_PROVIDER", "Dr. Emily Carter", "Cardiology");
        createProviderIfMissing("doctor2@tenalink.com", "doctor123", "ROLE_PROVIDER", "Dr. James Wilson", "Pediatrics");
        createProviderIfMissing("doctor3@tenalink.com", "doctor123", "ROLE_PROVIDER", "Dr. Maria Garcia", "Emergency Medicine");
        createProviderIfMissing("doctor4@tenalink.com", "doctor123", "ROLE_PROVIDER", "Dr. Robert Kim", "Radiology");
        createProviderIfMissing("doctor5@tenalink.com", "doctor123", "ROLE_PROVIDER", "Dr. Lisa Thompson", "General Practice");

        String[] patientNames = {
            "John Smith", "Emma Davis", "William Brown", "Olivia Jones", "James Miller",
            "Sophia Martinez", "Benjamin Anderson", "Isabella Taylor", "Lucas Thomas", "Mia Jackson",
            "Henry White", "Charlotte Harris", "Alexander Martin", "Amelia Thompson", "Daniel Garcia",
            "Harper Robinson", "Matthew Clark", "Evelyn Lewis", "Joseph Walker", "Abigail Hall"
        };

        for (int i = 0; i < 20; i++) {
            String email = String.format("patient%d@tenalink.com", i + 1);
            String name = patientNames[i];
            String faydaId = String.format("FAYDA%06d", i + 1);
            createPatientIfMissing(email, "patient123", "ROLE_PATIENT", name, faydaId, i);
        }

        ensureAllPatientRecordsExist();
        logger.info("Auth user data seeding complete.");
    }

    private void ensureAllPatientRecordsExist() {
        try {
            java.util.List<UserEntity> patientUsers =
                    userRepository.findByRoleOrderByCreatedAtDesc("ROLE_PATIENT");

            for (UserEntity user : patientUsers) {
                Integer count = userDbJdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM patients WHERE user_id = ?",
                        Integer.class,
                        user.getId()
                );

                if (count == null || count == 0) {
                    UUID patientId = UUID.randomUUID();

                    userDbJdbcTemplate.update(
                            "INSERT INTO patients (id, user_id, fayda_id, full_name, date_of_birth, gender, contact_phone, blood_type, allergies, chronic_conditions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            patientId,
                            user.getId(),
                            user.getFaydaId() != null
                                    ? user.getFaydaId()
                                    : "FAYDA" + user.getId().toString().substring(0, 8).toUpperCase(),
                            user.getFullName(),
                            "1990-01-01",
                            "UNKNOWN",
                            "+000000000",
                            "O+",
                            "[]",
                            "[]"
                    );

                    logger.info("Created missing patient record {} for existing user {}", patientId, user.getId());
                }
            }
        } catch (Exception e) {
            logger.warn("Could not verify patient records: {}", e.getMessage());
        }
    }

    private void createAdminIfMissing(String email, String rawPassword, String role, String fullName) {
        if (userRepository.findByEmail(email).isEmpty()) {
            UserEntity user = new UserEntity();
            user.setEmail(email);
            user.setFaydaId(null);
            user.setPasswordHash(passwordEncoder.encode(rawPassword));
            user.setFullName(fullName);
            user.setRole(normalizeRole(role));
            userRepository.save(user);
        }
    }

    private void createProviderIfMissing(String email, String rawPassword, String role, String fullName, String specialization) {
        if (userRepository.findByEmail(email).isEmpty()) {
            UserEntity user = new UserEntity();
            user.setEmail(email);
            user.setFaydaId(null);
            user.setPasswordHash(passwordEncoder.encode(rawPassword));
            user.setFullName(fullName);
            user.setRole(normalizeRole(role));
            userRepository.save(user);
        }
    }

    private void createPatientIfMissing(String email, String rawPassword, String role, String fullName, String faydaId, int index) {
        if (userRepository.findByEmail(email).isEmpty()) {
            UserEntity user = new UserEntity();
            user.setEmail(email);
            user.setFaydaId(faydaId);
            user.setPasswordHash(passwordEncoder.encode(rawPassword));
            user.setFullName(fullName);
            user.setRole(normalizeRole(role));
            userRepository.save(user);
        }
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) return "ROLE_PATIENT";
        String normalized = role.trim().toUpperCase();
        return normalized.startsWith("ROLE_") ? normalized : "ROLE_" + normalized;
    }
}