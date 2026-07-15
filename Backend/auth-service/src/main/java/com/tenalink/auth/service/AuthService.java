package com.tenalink.auth.service;
import com.tenalink.auth.dto.AuthDto;
import com.tenalink.auth.entity.UserEntity;
import com.tenalink.auth.exception.AuthenticationFailedException;
import com.tenalink.auth.exception.RegistrationException;
import com.tenalink.auth.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JdbcTemplate userDbJdbcTemplate;
    @Value("${jwt.secret}") private String jwtSecret;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder,
                       @Qualifier("userDbJdbcTemplate") JdbcTemplate userDbJdbcTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDbJdbcTemplate = userDbJdbcTemplate;
    }

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest req) {
        logger.info("Registration request for email: {}, faydaId: {}", req.getEmail(), req.getFaydaId());
        
        // Pre-registration validation: check for duplicate email
        Optional<UserEntity> existingEmail = userRepository.findByEmail(req.getEmail());
        logger.info("Email check result: {}", existingEmail.isPresent() ? "EXISTS" : "NOT FOUND");
        if (existingEmail.isPresent()) {
            logger.warn("Registration failed: Email already exists: {}", req.getEmail());
            throw new RegistrationException("The email address is already registered with TenaLink.");
        }

        // Pre-registration validation: check for duplicate Fayda ID
        if (req.getFaydaId() != null && !req.getFaydaId().isBlank()) {
            Optional<UserEntity> existingFayda = userRepository.findByFaydaId(req.getFaydaId());
            logger.info("FaydaId check result: {}", existingFayda.isPresent() ? "EXISTS" : "NOT FOUND");
            if (existingFayda.isPresent()) {
                logger.warn("Registration failed: Fayda ID already exists: {}", req.getFaydaId());
                throw new RegistrationException("The Fayda ID is already registered with TenaLink.");
            }
        }

        UserEntity user = new UserEntity();
        user.setEmail(req.getEmail());
        user.setFaydaId(req.getFaydaId());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setFullName(req.getFullName());
        String role = normalizeRole(req.getRole());
        user.setRole(role);
        user = userRepository.save(user);

        // Create domain record for patient role
        if ("ROLE_PATIENT".equals(role)) {
            try {
                UUID patientId = UUID.randomUUID();
                userDbJdbcTemplate.update(
                        "INSERT INTO patients (id, user_id, fayda_id, full_name, date_of_birth, gender, contact_phone) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        patientId, user.getId(), req.getFaydaId(), req.getFullName(), "2000-01-01", "UNKNOWN", "+000000000"
                );
                logger.info("Created patient record {} for registered user {}", patientId, user.getId());
            } catch (Exception e) {
                logger.warn("Could not create patient record for registered user {}: {}", user.getId(), e.getMessage());
            }
        }

        return createResponse(user);
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest req) {
        if(req == null || req.getIdentifier() == null || req.getIdentifier().isBlank()
                || req.getPassword() == null || req.getPassword().isBlank()) {
            logger.warn("Authentication failed due to missing identifier or password");
            throw new AuthenticationFailedException("Invalid credentials");
        }

        String identifier = req.getIdentifier().trim();
        logger.info("Login attempt for identifier {}", identifier);

        Optional<UserEntity> userOpt;
        if(identifier.contains("@")) {
            userOpt = userRepository.findByEmail(identifier);
        } else {
            userOpt = userRepository.findByFaydaId(identifier);
        }

        if (userOpt.isEmpty()) {
            logger.warn("Authentication failed for identifier {}: user not found", identifier);
            throw new AuthenticationFailedException("Invalid credentials");
        }

        UserEntity user = userOpt.get();

        if(!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            logger.warn("Authentication failed for identifier {}: invalid password", identifier);
            throw new AuthenticationFailedException("Invalid credentials");
        }

        logger.info("Authentication successful for user {} with role {}", user.getId(), user.getRole());
        return createResponse(user);
    }

    private String normalizeRole(String role) {
        if(role == null || role.isBlank()) return "ROLE_PATIENT";
        String normalized = role.trim().toUpperCase();
        return normalized.startsWith("ROLE_") ? normalized : "ROLE_" + normalized;
    }

    private AuthDto.AuthResponse createResponse(UserEntity user) {
        String token = Jwts.builder().subject(user.getId().toString()).claim("role", user.getRole())
                .issuedAt(new Date()).expiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8))).compact();
        AuthDto.AuthResponse res = new AuthDto.AuthResponse();
        res.setToken(token); res.setUserId(user.getId().toString()); res.setRole(user.getRole());
        return res;
    }
}
