package com.tenalink.auth.controller;

import com.tenalink.auth.dto.ContextDto;
import com.tenalink.auth.service.ContextService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/context")
public class ContextController {

    private static final Logger logger = LoggerFactory.getLogger(ContextController.class);

    private final ContextService contextService;

    public ContextController(ContextService contextService) {
        this.contextService = contextService;
    }

    @GetMapping("/me")
    public ResponseEntity<ContextDto.IdentityContext> me(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            logger.warn("Unauthenticated request to /context/me");
            return ResponseEntity.status(401).build();
        }

        try {
            ContextDto.IdentityContext ctx = contextService.getIdentityContext(authentication);
            return ResponseEntity.ok(ctx);
        } catch (Exception e) {
            logger.error("Failed to resolve identity context", e);
            return ResponseEntity.status(500).build();
        }
    }
}
