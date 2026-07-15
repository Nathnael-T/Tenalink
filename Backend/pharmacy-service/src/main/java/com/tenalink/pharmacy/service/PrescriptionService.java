package com.tenalink.pharmacy.service;
import com.tenalink.pharmacy.dto.PrescriptionDto;
import com.tenalink.pharmacy.entity.PrescriptionEntity;
import com.tenalink.pharmacy.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
@Service
public class PrescriptionService {
    private final PrescriptionRepository repo;
    public PrescriptionService(PrescriptionRepository repo) { this.repo = repo; }
    public PrescriptionEntity create(PrescriptionDto.CreateRequest req) {
        PrescriptionEntity p = new PrescriptionEntity();
        p.setPatientId(req.getPatientId()); p.setDoctorId(req.getDoctorId());
        p.setMedication(req.getMedication()); p.setDosage(req.getDosage());
        p.setPrescribedAt(req.getPrescribedAt()); p.setStatus("ACTIVE");
        return repo.save(p);
    }
    public List<PrescriptionEntity> getByPatient(UUID patientId) { return repo.findByPatientIdOrderByPrescribedAtDesc(patientId); }
    public List<PrescriptionEntity> getByDoctor(UUID doctorId) { return repo.findByDoctorIdOrderByPrescribedAtDesc(doctorId); }
    public void fulfill(UUID id) {
        PrescriptionEntity p = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        p.setStatus("FULFILLED");
        repo.save(p);
    }
}
