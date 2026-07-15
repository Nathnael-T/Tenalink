package com.tenalink.auth.exception;

import com.tenalink.auth.exception.AuthenticationFailedException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationFailedException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationFailed(AuthenticationFailedException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Unauthorized", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(RegistrationException.class)
    public ResponseEntity<ErrorResponse> handleRegistrationException(RegistrationException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.CONFLICT.value(), "Conflict", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String message = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
        String userMessage;
        if (message != null && (message.contains("email") || message.contains("uk6dotkott2kjsp8vw4d0m25fb7"))) {
            userMessage = "This email address is already registered in TenaLink.";
        } else if (message != null && message.contains("fayda_id")) {
            userMessage = "The provided fayda_id already exists in TenaLink.";
        } else {
            userMessage = "Data integrity violation occurred.";
        }
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.CONFLICT.value(), "Conflict", userMessage);
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }
}
