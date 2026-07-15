package com.tenalink.medicalrecords.bootstrap;

import com.tenalink.medicalrecords.entity.MedicalEventEntity;
import com.tenalink.medicalrecords.repository.MedicalEventRepository;
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
public class MedicalEventSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(MedicalEventSeeder.class);
    private final MedicalEventRepository repo;
    private final JdbcTemplate userDbJdbcTemplate;

    public MedicalEventSeeder(MedicalEventRepository repo,
                              @Qualifier("userDbJdbcTemplate") JdbcTemplate userDbJdbcTemplate) {
        this.repo = repo;
        this.userDbJdbcTemplate = userDbJdbcTemplate;
    }

    @Override
    public void run(String... args) {
        logger.info("Seeding medical event data...");

        try {
            List<UUID> patientIds = userDbJdbcTemplate.queryForList(
                    "SELECT id FROM patients LIMIT 10", UUID.class);
            List<UUID> doctorIds = userDbJdbcTemplate.queryForList(
                    "SELECT id FROM doctors LIMIT 5", UUID.class);

            if (patientIds.isEmpty() || doctorIds.isEmpty()) {
                logger.warn("Not enough patients or doctors to seed medical events");
                return;
            }

            String[] eventTypes = {"DIAGNOSIS", "LAB_RESULT", "PRESCRIPTION", "VITALS", "ALLERGY", "VISIT_CREATED"};
            String[][] eventDataSamples = {
                {"{\"condition\":\"Hypertension\",\"notes\":\"Blood pressure 140/90\"}", "DIAGNOSIS"},
                {"{\"test\":\"CBC\",\"result\":\"Normal\",\"unit\":\"\"}", "LAB_RESULT"},
                {"{\"medication\":\"Lisinopril\",\"dosage\":\"10mg daily\"}", "PRESCRIPTION"},
                {"{\"vitals\":{\"bp\":\"120/80\",\"heartRate\":72,\"temperature\":98.6}}", "VITALS"},
                {"{\"allergen\":\"Penicillin\",\"severity\":\"Moderate\"}", "ALLERGY"},
                {"{\"title\":\"Regular Checkup\",\"summary\":\"Patient in good health\"}", "VISIT_CREATED"}
            };

            int eventCount = 0;
            for (int i = 0; i < Math.min(10, patientIds.size()); i++) {
                for (int j = 0; j < Math.min(3, eventDataSamples.length); j++) {
                    UUID patientId = patientIds.get(i);
                    UUID doctorId = doctorIds.get(i % doctorIds.size());
                    UUID hospitalId = UUID.randomUUID(); // Random hospital reference

                    createIfMissing(
                        patientId,
                        hospitalId,
                        doctorId,
                        eventDataSamples[j][1],
                        eventDataSamples[j][0],
                        Instant.now().minus(5 + eventCount * 2, ChronoUnit.DAYS)
                    );
                    eventCount++;
                }
            }

            logger.info("Seeded {} medical events", eventCount);
        } catch (Exception e) {
            logger.error("Failed to seed medical events: {}", e.getMessage());
        }

        logger.info("Medical event seeding complete.");
    }

    private void createIfMissing(UUID patientId, UUID hospitalId, UUID authorId, String eventType, String eventData, Instant timestamp) {
        MedicalEventEntity e = new MedicalEventEntity();
        e.setPatientId(patientId);
        e.setHospitalId(hospitalId);
        e.setAuthorId(authorId);
        e.setEventType(eventType);
        e.setEventData(eventData);
        e.setTimestamp(timestamp);
        repo.save(e);
    }
}
