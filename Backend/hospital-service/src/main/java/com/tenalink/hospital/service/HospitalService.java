package com.tenalink.hospital.service;

import com.tenalink.hospital.dto.HospitalDto;
import com.tenalink.hospital.entity.HospitalEntity;
import com.tenalink.hospital.repository.HospitalRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class HospitalService {

    private final HospitalRepository repo;

    public HospitalService(HospitalRepository repo) {
        this.repo = repo;
    }

    public List<HospitalEntity> getAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    public Page<HospitalEntity> getAllPaginated(Pageable pageable) {
        return repo.findAll(pageable);
    }

    public HospitalEntity getById(String id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Hospital not found"));
    }

    public List<HospitalEntity> getBySpecialty(String specialty) {
        return repo.findBySpecialtyIgnoreCaseOrderByCreatedAtDesc(specialty);
    }

    public HospitalEntity create(HospitalDto.CreateRequest req) {
        HospitalEntity h = new HospitalEntity();
        h.setId("h-" + UUID.randomUUID().toString().substring(0, 8));
        h.setName(req.getName());
        h.setSpecialty(req.getSpecialty());
        h.setWaitTime(req.getWaitTime());
        h.setAddress(req.getAddress());
        h.setContact(req.getContact());
        h.setLatitude(req.getLatitude());
        h.setLongitude(req.getLongitude());
        h.setIcuAvailable(req.isIcuAvailable());
        h.setLabAvailable(req.isLabAvailable());
        h.setPharmacyAvailable(req.isPharmacyAvailable());
        h.setRadiologyAvailable(req.isRadiologyAvailable());
        h.setAmbulanceAccess(req.isAmbulanceAccess());
        h.setGlucoseAvailable(req.isGlucoseAvailable());
        return repo.save(h);
    }

    public HospitalEntity update(String id, HospitalDto.UpdateRequest req) {
        HospitalEntity h = getById(id);
        if (req.getName() != null) h.setName(req.getName());
        if (req.getSpecialty() != null) h.setSpecialty(req.getSpecialty());
        if (req.getWaitTime() != null) h.setWaitTime(req.getWaitTime());
        if (req.getAddress() != null) h.setAddress(req.getAddress());
        if (req.getContact() != null) h.setContact(req.getContact());
        if (req.getLatitude() != null) h.setLatitude(req.getLatitude());
        if (req.getLongitude() != null) h.setLongitude(req.getLongitude());
        if (req.getIcuAvailable() != null) h.setIcuAvailable(req.getIcuAvailable());
        if (req.getLabAvailable() != null) h.setLabAvailable(req.getLabAvailable());
        if (req.getPharmacyAvailable() != null) h.setPharmacyAvailable(req.getPharmacyAvailable());
        if (req.getRadiologyAvailable() != null) h.setRadiologyAvailable(req.getRadiologyAvailable());
        if (req.getAmbulanceAccess() != null) h.setAmbulanceAccess(req.getAmbulanceAccess());
        if (req.getGlucoseAvailable() != null) h.setGlucoseAvailable(req.getGlucoseAvailable());
        return repo.save(h);
    }

    public void delete(String id) {
        HospitalEntity h = getById(id);
        repo.delete(h);
    }
}
