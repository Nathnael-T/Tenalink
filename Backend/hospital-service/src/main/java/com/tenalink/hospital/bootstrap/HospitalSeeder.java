package com.tenalink.hospital.bootstrap;

import com.tenalink.hospital.entity.HospitalEntity;
import com.tenalink.hospital.repository.HospitalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class HospitalSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(HospitalSeeder.class);
    private final HospitalRepository repo;

    public HospitalSeeder(HospitalRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) {
        logger.info("Seeding hospital data...");
        createIfMissing("h1", "Addis General Hospital", "General", "Tegela Building, Bole Rd, Addis Ababa", "+251-11-555-0001");
        createIfMissing("h2", "St. Mary Specialty Clinic", "Cardiology", "45 Arada Ave, Addis Ababa", "+251-11-555-0002");
        createIfMissing("h3", "Northern Emergency Center", "Emergency", "12 Meskel Square, Addis Ababa", "+251-11-555-0003");
        createIfMissing("h4", "Eastside Diagnostic Lab", "Radiology", "78 Gerji Rd, Addis Ababa", "+251-11-555-0004");
        createIfMissing("h5", "Westside Pediatric Center", "Pediatrics", "23 Sarbet St, Addis Ababa", "+251-11-555-0005");
        logger.info("Hospital seeding complete.");
    }

    private void createIfMissing(String id, String name, String specialty, String address, String contact) {
        if (repo.findById(id).isPresent()) return;
        HospitalEntity h = new HospitalEntity();
        h.setId(id);
        h.setName(name);
        h.setSpecialty(specialty);
        h.setAddress(address);
        h.setContact(contact);
        h.setWaitTime(15);
        h.setLatitude(9.0 + Math.random());
        h.setLongitude(38.7 + Math.random());
        h.setIcuAvailable(true);
        h.setLabAvailable(true);
        h.setPharmacyAvailable(true);
        h.setRadiologyAvailable(specialty.equals("Radiology") || specialty.equals("Emergency"));
        h.setAmbulanceAccess(specialty.equals("Emergency"));
        h.setGlucoseAvailable(true);
        repo.save(h);
        logger.info("Seeded hospital: {}", name);
    }
}
