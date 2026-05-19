package com.bookmyevent.booking_service.controller;

import com.bookmyevent.booking_service.requestDto.LoginUserRequestDto;
import com.bookmyevent.booking_service.responseDto.ApiResponse;
import com.bookmyevent.booking_service.responseDto.LoginUserResponseDto;
import com.bookmyevent.booking_service.responseDto.RegisterUserResponseDto;
import com.bookmyevent.booking_service.requestDto.RegisterUserRequestDto;
import com.bookmyevent.booking_service.service.AuthService;
import com.bookmyevent.booking_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterUserResponseDto>> register(RegisterUserRequestDto requestDto) {
        RegisterUserResponseDto responseDto = authService.registerUser(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "User registered successfully", responseDto));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginUserResponseDto>> login(LoginUserRequestDto requestDto) {

    }
}
