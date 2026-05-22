package com.bookmyevent.user_service.controller;

import com.bookmyevent.user_service.requestDto.PasswordChangeRequestDto;
import com.bookmyevent.user_service.responseDto.UserProfileResponseDto;
import com.bookmyevent.user_service.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponseDto> getUserProfile(@AuthenticationPrincipal String username) {
        UserProfileResponseDto profile = userService.getUserProfile(username);

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@AuthenticationPrincipal String username, @RequestBody PasswordChangeRequestDto requestDto) {
        String message = userService.changePassword(username, requestDto);

        return ResponseEntity.ok(message);
    }
}
