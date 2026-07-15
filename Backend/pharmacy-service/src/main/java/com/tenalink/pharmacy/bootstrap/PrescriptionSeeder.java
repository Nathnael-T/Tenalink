package com.tenalink.pharmacy.bootstrap;

import com.tenalink.pharmacy.entity.PrescriptionEntity;
import com.tenalink.pharmacy.repository.PrescriptionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class PrescriptionSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(PrescriptionSeeder.class);
    private final PrescriptionRepository repo;
    private final JdbcTemplate userDbJdbcTemplate;

    public PrescriptionSeeder(PrescriptionRepository repo,
                              @Qualifier("userDbJdbcTemplate") JdbcTemplate userDbJdbcTemplate) {
        this.repo = repo;
        this.userDbJdbcTemplate = userDbJdbcTemplate;
    }

    @Override
    public void run(String... args) {
        logger.info("Seeding prescription data...");

        try {
            List<UUID> patientIds = userDbJdbcTemplate.queryForList(
                    "SELECT id FROM patients LIMIT 10", UUID.class);
            List<UUID> doctorIds = userDbJdbcTemplate.queryForList(
                    "SELECT id FROM doctors LIMIT 5", UUID.class);

            if (patientIds.isEmpty() || doctorIds.isEmpty()) {
                logger.warn("Not enough patients or doctors to seed prescriptions");
                return;
            }

            String[][] medications = {
                {"Lisinopril", "10mg once daily"},
                {"Metformin", "500mg twice daily"},
                {"Amoxicillin", "250mg three times daily"},
                {"Ibuprofen", "400mg as needed"},
                {"Omeprazole", "20mg daily"},
                {"Atorvastatin", "40mg daily"},
                {"Amlodipine", "5mg daily"},
                {"Levothyroxine", "50mcg daily"}
            };

            String[] statuses = {"ACTIVE", "ACTIVE", "FULFILLED"};
            int prescriptionCount = 0;

            for (int i = 0; i < Math.min(10, patientIds.size()); i++) {
                for (int j = 0; j < Math.min(2, medications.length); j++) {
                    UUID patientId = patientIds.get(i);
                    UUID doctorId = doctorIds.get(i % doctorIds.size());
                    String status = statuses[(i + j) % statuses.length];

                    createIfMissing(
                        patientId,
                        doctorId,
                        medications[(i + j) % medications.length][0],
                        medications[(i + j) % medications.length][1],
                        status,
                        Instant.now().minus(5 + prescriptionCount, ChronoUnit.DAYS)
                    );
                    prescriptionCount++;
                }
            }

            logger.info("Seeded {} prescriptions", prescriptionCount);
        } catch (Exception e) {
            logger.error("Failed to seed prescriptions: {}", e.getMessage());
        }

        logger.info("Prescription seeding complete.");
    }

    private void createIfMissing(UUID patientId, UUID doctorId, String medication, String dosage, String status, Instant prescribedAt) {
        PrescriptionEntity p = new PrescriptionEntity();
        p.setPatientId(patientId);
        p.setDoctorId(doctorId);
        p.setMedication(medication);
        p.setDosage(dosage);
        p.setStatus(status);
        p.setPrescribedAt(prescribedAt);
        repo.save(p);
    }
}
