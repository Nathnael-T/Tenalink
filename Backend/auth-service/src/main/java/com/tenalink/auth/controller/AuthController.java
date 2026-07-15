package com.tenalink.auth.controller;
import com.tenalink.auth.dto.AuthDto;
import com.tenalink.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }
    @PostMapping("/login") public ResponseEntity<AuthDto.AuthResponse> login(@RequestBody AuthDto.LoginRequest req) { return ResponseEntity.ok(authService.login(req)); }
    @PostMapping("/register") public ResponseEntity<AuthDto.AuthResponse> register(@RequestBody AuthDto.RegisterRequest req) { return ResponseEntity.ok(authService.register(req)); }
}
