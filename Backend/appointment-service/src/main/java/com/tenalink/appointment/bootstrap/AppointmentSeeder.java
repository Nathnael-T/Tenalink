package com.tenalink.appointment.bootstrap;

import com.tenalink.appointment.entity.AppointmentEntity;
import com.tenalink.appointment.repository.AppointmentRepository;
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
public class AppointmentSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentSeeder.class);
    private final AppointmentRepository repo;
    private final JdbcTemplate userDbJdbcTemplate;

    public AppointmentSeeder(AppointmentRepository repo,
                             @Qualifier("userDbJdbcTemplate") JdbcTemplate userDbJdbcTemplate) {
        this.repo = repo;
        this.userDbJdbcTemplate = userDbJdbcTemplate;
    }

    @Override
    public void run(String... args) {
        logger.info("Seeding appointment data...");

        try {
            // Get first 5 doctor IDs from user_db
            List<UUID> doctorIds = userDbJdbcTemplate.queryForList(
                    "SELECT id FROM doctors LIMIT 5", UUID.class);

            // Get first 10 patient IDs from user_db
            List<UUID> patientIds = userDbJdbcTemplate.queryForList(
                    "SELECT id FROM patients LIMIT 10", UUID.class);

            if (doctorIds.isEmpty() || patientIds.isEmpty()) {
                logger.warn("Not enough doctors or patients to seed appointments");
                return;
            }

            String[] hospitalNames = {
                "Addis General Hospital", "St. Mary Specialty Clinic",
                "Northern Emergency Center", "Eastside Diagnostic Lab",
                "Westside Pediatric Center"
            };

            // Get doctor names
            List<String> doctorNames = userDbJdbcTemplate.queryForList(
                    "SELECT full_name FROM doctors LIMIT 5", String.class);

            // Get patient names
            List<String> patientNames = userDbJdbcTemplate.queryForList(
                    "SELECT full_name FROM patients LIMIT 10", String.class);

            // Create past appointments (COMPLETED)
            for (int i = 0; i < 5 && i < patientIds.size() && i < doctorIds.size(); i++) {
                createIfMissing(
                    "COMPLETED",
                    Instant.now().minus(10 + i, ChronoUnit.DAYS),
                    patientIds.get(i),
                    doctorIds.get(i % doctorIds.size()),
                    patientNames.get(i),
                    doctorNames.get(i % doctorNames.size()),
                    hospitalNames[i % hospitalNames.length],
                    "Regular checkup",
                    Instant.now().minus(10 + i, ChronoUnit.DAYS).toString().substring(0, 10),
                    "10:00"
                );
            }

            // Create future appointments (SCHEDULED)
            for (int i = 0; i < 5 && i + 5 < patientIds.size() && i < doctorIds.size(); i++) {
                createIfMissing(
                    "SCHEDULED",
                    Instant.now().plus(3 + i * 2, ChronoUnit.DAYS),
                    patientIds.get(i + 5),
                    doctorIds.get(i % doctorIds.size()),
                    patientNames.get(i + 5),
                    doctorNames.get(i % doctorNames.size()),
                    hospitalNames[(i + 1) % hospitalNames.length],
                    "Follow-up visit",
                    Instant.now().plus(3 + i * 2, ChronoUnit.DAYS).toString().substring(0, 10),
                    "14:00"
                );
            }

            // Create cancelled appointments
            for (int i = 0; i < 2 && i + 10 < patientIds.size() && i < doctorIds.size(); i++) {
                createIfMissing(
                    "CANCELLED",
                    Instant.now().minus(5 + i, ChronoUnit.DAYS),
                    patientIds.get(i + 10 < patientIds.size() ? i + 10 : i),
                    doctorIds.get(i % doctorIds.size()),
                    patientNames.get(i + 10 < patientNames.size() ? i + 10 : i),
                    doctorNames.get(i % doctorNames.size()),
                    hospitalNames[(i + 2) % hospitalNames.length],
                    "Cancelled appointment",
                    Instant.now().minus(5 + i, ChronoUnit.DAYS).toString().substring(0, 10),
                    "09:00"
                );
            }

        } catch (Exception e) {
            logger.error("Failed to seed appointments: {}", e.getMessage());
        }

        logger.info("Appointment seeding complete.");
    }

    private void createIfMissing(String status, Instant scheduledAt, UUID patientId, UUID doctorId,
                                  String patientName, String doctorName, String hospitalName,
                                  String reason, String date, String time) {
        AppointmentEntity a = new AppointmentEntity();
        a.setPatientId(patientId);
        a.setDoctorId(doctorId);
        // Using a sample hospital string like "h1" or extracting from hospitalName if desired. Let's just use "h1" to "h4" randomly or a fixed one.
        a.setHospitalId("h" + ((Math.abs(hospitalName.hashCode()) % 4) + 1));
        a.setScheduledAt(scheduledAt);
        a.setStatus(status);
        a.setPatientName(patientName);
        a.setDoctorName(doctorName);
        a.setHospitalName(hospitalName);
        a.setReason(reason);
        a.setDate(date);
        a.setTime(time);
        repo.save(a);
        logger.info("Seeded {} appointment for patient {} with doctor {}", status, patientName, doctorName);
    }
}
