package com.tenalink.gateway;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        // Mock login response
        Map<String, Object> response = new HashMap<>();
        response.put("token", "Y2Sebh1JR23x");
        response.put("user", new HashMap<String, Object>() {{
            put("id", 1);
            put("email", request.getEmail());
            put("name", "John Doe");
            put("role", "USER");
        }});
        response.put("message", "Login successful");
        return response;
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody RegisterRequest request) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Registration successful");
        response.put("userId", "123");
        return response;
    }

    @GetMapping("/validate")
    public Map<String, Boolean> validate(@RequestHeader("Authorization") String token) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("valid", token != null && !token.isEmpty());
        return response;
    }

    public static class LoginRequest {
        public String email;
        public String password;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        public String email;
        public String password;
        public String name;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
}
