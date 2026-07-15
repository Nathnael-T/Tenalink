package com.tenalink.auth.service;

import com.tenalink.auth.dto.ContextDto;
import com.tenalink.auth.entity.UserEntity;
import com.tenalink.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ContextService {

    private static final Logger logger = LoggerFactory.getLogger(ContextService.class);

    private final UserRepository userRepository;
    private final JdbcTemplate userDbJdbcTemplate;

    public ContextService(UserRepository userRepository,
                          @Qualifier("userDbJdbcTemplate") JdbcTemplate userDbJdbcTemplate) {
        this.userRepository = userRepository;
        this.userDbJdbcTemplate = userDbJdbcTemplate;
    }

    public ContextDto.IdentityContext getIdentityContext(Authentication authentication) {
        String userIdStr = authentication.getName();
        UUID userId = UUID.fromString(userIdStr);

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found for id {}", userId);
                    return new RuntimeException("User not found");
                });

        ContextDto.IdentityContext ctx = new ContextDto.IdentityContext();
        ctx.setUserId(user.getId().toString());
        ctx.setRole(user.getRole());

        switch (user.getRole()) {
            case "ROLE_PATIENT":
                ctx.setPatientId(resolvePatientId(user.getId()));
                break;
            case "ROLE_PROVIDER":
                ctx.setDoctorId(resolveDoctorId(user.getId()));
                break;
            case "ROLE_ADMIN":
            case "ROLE_SUPER_ADMIN":
                ctx.setAdminId(user.getId().toString());
                break;
            default:
                logger.warn("Unknown role {} for user {}", user.getRole(), user.getId());
        }

        return ctx;
    }

    private String resolvePatientId(UUID userId) {
        try {
            return userDbJdbcTemplate.queryForObject(
                    "SELECT id FROM patients WHERE user_id = ? LIMIT 1",
                    String.class,
                    userId
            );
        } catch (Exception e) {
            logger.warn("Patient record not found for userId {}", userId);
            return null;
        }
    }

    private String resolveDoctorId(UUID userId) {
        try {
            return userDbJdbcTemplate.queryForObject(
                    "SELECT id FROM doctors WHERE user_id = ? LIMIT 1",
                    String.class,
                    userId
            );
        } catch (Exception e) {
            logger.warn("Doctor record not found for userId {}", userId);
            return null;
        }
    }
}
