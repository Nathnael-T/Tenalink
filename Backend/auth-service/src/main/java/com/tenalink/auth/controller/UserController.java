package com.tenalink.auth.controller;

import com.tenalink.auth.dto.UserDto;
import com.tenalink.auth.entity.UserEntity;
import com.tenalink.auth.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<UserEntity> userPage = userRepository.findAll(pageRequest);
        
        List<UserDto.Response> content = userPage.getContent().stream()
                .map(this::toResponse)
                .toList();
        
        Map<String, Object> response = Map.of(
                "content", content,
                "page", userPage.getNumber(),
                "size", userPage.getSize(),
                "totalElements", userPage.getTotalElements(),
                "totalPages", userPage.getTotalPages()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserDto.Response>> getByRole(@PathVariable String role) {
        String normalizedRole = role.toUpperCase();
        if (!normalizedRole.startsWith("ROLE_")) {
            normalizedRole = "ROLE_" + normalizedRole;
        }
        List<UserDto.Response> users = userRepository.findByRoleOrderByCreatedAtDesc(normalizedRole)
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/stats")
    public ResponseEntity<UserDto.StatsResponse> getStats() {
        long total = userRepository.count();
        long patients = userRepository.countByRole("ROLE_PATIENT");
        long doctors = userRepository.countByRole("ROLE_PROVIDER");
        long admins = userRepository.countByRole("ROLE_ADMIN");
        long superAdmins = userRepository.countByRole("ROLE_SUPER_ADMIN");

        UserDto.StatsResponse stats = new UserDto.StatsResponse();
        stats.setTotalUsers(total);
        stats.setPatients(patients);
        stats.setDoctors(doctors);
        stats.setAdmins(admins);
        stats.setSuperAdmins(superAdmins);
        return ResponseEntity.ok(stats);
    }

    private UserDto.Response toResponse(UserEntity user) {
        UserDto.Response response = new UserDto.Response();
        response.setId(user.getId().toString());
        response.setEmail(user.getEmail());
        response.setFaydaId(user.getFaydaId());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
    
}

