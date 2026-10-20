package com.bookmyevent.user_service.controller;

import com.bookmyevent.user_service.responseDto.ApiResponse;
import com.bookmyevent.user_service.responseDto.UserProfileResponseDto;
import com.bookmyevent.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Admin-only endpoints; access is enforced in SecurityConfig (/api/admin/**). */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserProfileResponseDto>>> getAllUsers() {
        List<UserProfileResponseDto> users = userService.getAllUsers();
        return ResponseEntity.ok(new ApiResponse<>(true, "Users fetched successfully!", users));
    }
}
