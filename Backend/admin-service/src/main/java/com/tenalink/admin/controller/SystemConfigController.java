package com.tenalink.admin.controller;

import com.tenalink.admin.dto.SystemConfigDto;
import com.tenalink.admin.entity.SystemConfigEntity;
import com.tenalink.admin.service.SystemConfigService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/system-config")
public class SystemConfigController {

    private final SystemConfigService service;

    public SystemConfigController(SystemConfigService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SystemConfigEntity>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{key}")
    public ResponseEntity<SystemConfigEntity> getByKey(@PathVariable String key) {
        return ResponseEntity.ok(service.getByKey(key));
    }

    @PostMapping
    public ResponseEntity<SystemConfigEntity> create(@RequestBody SystemConfigDto.CreateRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @PutMapping("/{key}")
    public ResponseEntity<SystemConfigEntity> upsert(@PathVariable String key, @RequestBody SystemConfigDto.UpdateRequest req) {
        return ResponseEntity.ok(service.upsert(key, req));
    }

    @DeleteMapping("/{key}")
    public ResponseEntity<Void> delete(@PathVariable String key) {
        service.delete(key);
        return ResponseEntity.ok().build();
    }
}
