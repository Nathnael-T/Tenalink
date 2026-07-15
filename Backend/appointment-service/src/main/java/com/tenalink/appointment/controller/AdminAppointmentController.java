package com.tenalink.appointment.controller;

import com.tenalink.appointment.dto.AppointmentDto;
import com.tenalink.appointment.entity.AppointmentEntity;
import com.tenalink.appointment.service.AppointmentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/appointments")
public class AdminAppointmentController {

    private final AppointmentService service;

    public AdminAppointmentController(AppointmentService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("scheduledAt").descending());
        Page<AppointmentEntity> apptPage = service.getAllPaginated(pageRequest);
        
        Map<String, Object> response = Map.of(
                "content", apptPage.getContent(),
                "page", apptPage.getNumber(),
                "size", apptPage.getSize(),
                "totalElements", apptPage.getTotalElements(),
                "totalPages", apptPage.getTotalPages()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/overview")
    public ResponseEntity<AppointmentDto.OverviewResponse> getOverview() {
        AppointmentDto.OverviewResponse resp = new AppointmentDto.OverviewResponse();
        resp.setTotalAppointments(service.count());
        resp.setScheduled(service.countByStatus("SCHEDULED"));
        resp.setCompleted(service.countByStatus("COMPLETED"));
        resp.setCancelled(service.countByStatus("CANCELLED"));
        resp.setNoShow(service.countByStatus("NO_SHOW"));
        return ResponseEntity.ok(resp);
    }
}
