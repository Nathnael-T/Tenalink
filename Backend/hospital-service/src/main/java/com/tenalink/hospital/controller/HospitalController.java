package com.tenalink.hospital.controller;

import com.tenalink.hospital.dto.HospitalDto;
import com.tenalink.hospital.entity.HospitalEntity;
import com.tenalink.hospital.service.HospitalService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/hospitals")
public class HospitalController {

    private final HospitalService service;

    public HospitalController(HospitalService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<HospitalEntity> hospitalPage = service.getAllPaginated(pageRequest);

        List<HospitalDto.Response> content = hospitalPage.getContent().stream()
                .map(this::toResponse)
                .toList();

        Map<String, Object> response = Map.of(
                "content", content,
                "page", hospitalPage.getNumber(),
                "size", hospitalPage.getSize(),
                "totalElements", hospitalPage.getTotalElements(),
                "totalPages", hospitalPage.getTotalPages()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalDto.Response> getById(@PathVariable String id) {
        return ResponseEntity.ok(toResponse(service.getById(id)));
    }

    @GetMapping("/specialty/{specialty}")
    public ResponseEntity<List<HospitalDto.Response>> getBySpecialty(@PathVariable String specialty) {
        return ResponseEntity.ok(service.getBySpecialty(specialty).stream()
                .map(this::toResponse)
                .toList());
    }

    @PostMapping
    public ResponseEntity<HospitalDto.Response> create(@RequestBody HospitalDto.CreateRequest req) {
        return ResponseEntity.ok(toResponse(service.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HospitalDto.Response> update(@PathVariable String id, @RequestBody HospitalDto.UpdateRequest req) {
        return ResponseEntity.ok(toResponse(service.update(id, req)));
    }

    private HospitalDto.Response toResponse(HospitalEntity hospital) {
        HospitalDto.Response response = new HospitalDto.Response();
        response.setId(hospital.getId());
        response.setName(hospital.getName());
        response.setSpecialty(hospital.getSpecialty());
        response.setWaitTime(hospital.getWaitTime());
        response.setAddress(hospital.getAddress());
        response.setContact(hospital.getContact());
        response.setLatitude(hospital.getLatitude());
        response.setLongitude(hospital.getLongitude());
        response.setIcuAvailable(hospital.isIcuAvailable());
        response.setLabAvailable(hospital.isLabAvailable());
        response.setPharmacyAvailable(hospital.isPharmacyAvailable());
        response.setRadiologyAvailable(hospital.isRadiologyAvailable());
        response.setAmbulanceAccess(hospital.isAmbulanceAccess());
        response.setGlucoseAvailable(hospital.isGlucoseAvailable());
        return response;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
