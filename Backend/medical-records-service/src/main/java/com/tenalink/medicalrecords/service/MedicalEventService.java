package com.tenalink.medicalrecords.service;

import com.tenalink.medicalrecords.dto.MedicalEventDto;
import com.tenalink.medicalrecords.entity.MedicalEventEntity;
import com.tenalink.medicalrecords.repository.MedicalEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MedicalEventService {
    private final MedicalEventRepository repo;
    private final MedicalEventMapper mapper;

    public MedicalEventService(MedicalEventRepository repo, MedicalEventMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    public MedicalEventDto.TimelineResponse create(MedicalEventDto.CreateRequest req) {
        MedicalEventEntity entity = new MedicalEventEntity();
        entity.setPatientId(req.getPatientId());
        entity.setHospitalId(req.getHospitalId());
        entity.setAuthorId(req.getAuthorId());
        entity.setTimestamp(req.getTimestamp());
        entity.setEventType(req.getEventType());
        entity.setEventData(req.getEventData());
        return mapper.toTimelineResponse(repo.save(entity));
    }

    public List<MedicalEventDto.TimelineResponse> getTimeline(UUID patientId) {
        return repo.findByPatientIdOrderByTimestampDesc(patientId).stream()
                .map(mapper::toTimelineResponse)
                .toList();
    }

    public List<MedicalEventDto.TimelineResponse> getDocuments(UUID patientId) {
        return repo.findByPatientIdAndEventTypeOrderByTimestampDesc(patientId, "DOCUMENT").stream()
                .map(mapper::toTimelineResponse)
                .toList();
    }
}
