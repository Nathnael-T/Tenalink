package com.tenalink.admin.controller;
import com.tenalink.admin.dto.AuditLogDto;
import com.tenalink.admin.entity.AuditLogEntity;
import com.tenalink.admin.service.AuditLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/audit-logs")
public class AuditLogController {
    private final AuditLogService service;
    public AuditLogController(AuditLogService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<AuditLogEntity> create(@RequestBody AuditLogDto.CreateRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<AuditLogEntity>> getByAdmin(@PathVariable UUID adminId) {
        return ResponseEntity.ok(service.getByAdmin(adminId));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<AuditLogEntity> logPage = service.getAllPaginated(pageRequest);
        
        Map<String, Object> response = Map.of(
                "content", logPage.getContent(),
                "page", logPage.getNumber(),
                "size", logPage.getSize(),
                "totalElements", logPage.getTotalElements(),
                "totalPages", logPage.getTotalPages()
        );
        
        return ResponseEntity.ok(response);
    }
}
