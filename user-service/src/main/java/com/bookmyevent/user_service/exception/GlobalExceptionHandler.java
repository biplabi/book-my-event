package com.bookmyevent.user_service.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<CustomErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, HttpServletRequest request) {
        CustomErrorResponse errorResponse = CustomErrorResponse.builder()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .success(false)
                .message(ex.getMessage())
                .apiPath(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<CustomErrorResponse> handleDuplicateResourceException(DuplicateResourceException ex, HttpServletRequest request) {
        CustomErrorResponse errorResponse = CustomErrorResponse.builder()
                .statusCode(HttpStatus.CONFLICT.value())
                .success(false)
                .message(ex.getMessage())
                .apiPath(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }
}
