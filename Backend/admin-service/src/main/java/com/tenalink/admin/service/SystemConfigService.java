package com.tenalink.admin.service;

import com.tenalink.admin.dto.SystemConfigDto;
import com.tenalink.admin.entity.SystemConfigEntity;
import com.tenalink.admin.repository.SystemConfigRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SystemConfigService {

    private final SystemConfigRepository repo;

    public SystemConfigService(SystemConfigRepository repo) {
        this.repo = repo;
    }

    public List<SystemConfigEntity> getAll() {
        return repo.findAll();
    }

    public SystemConfigEntity getByKey(String key) {
        return repo.findByConfigKey(key)
                .orElseThrow(() -> new RuntimeException("Config key not found: " + key));
    }

    public SystemConfigEntity create(SystemConfigDto.CreateRequest req) {
        if (repo.existsByConfigKey(req.getConfigKey())) {
            throw new RuntimeException("Config key already exists: " + req.getConfigKey());
        }
        SystemConfigEntity e = new SystemConfigEntity();
        e.setConfigKey(req.getConfigKey());
        e.setConfigValue(req.getConfigValue());
        e.setDescription(req.getDescription());
        return repo.save(e);
    }

    public SystemConfigEntity upsert(String key, SystemConfigDto.UpdateRequest req) {
        SystemConfigEntity e = repo.findByConfigKey(key).orElse(new SystemConfigEntity());
        e.setConfigKey(key);
        if (req.getConfigValue() != null) e.setConfigValue(req.getConfigValue());
        if (req.getDescription() != null) e.setDescription(req.getDescription());
        return repo.save(e);
    }

    public void delete(String key) {
        SystemConfigEntity e = getByKey(key);
        repo.delete(e);
    }
}
