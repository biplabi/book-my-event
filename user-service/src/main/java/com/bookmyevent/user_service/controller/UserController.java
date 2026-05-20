package com.bookmyevent.user_service.controller;

import com.bookmyevent.user_service.responseDto.UserProfileResponseDto;
import com.bookmyevent.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponseDto> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        UserProfileResponseDto profile = userService.getUserProfile(username);

        return ResponseEntity.ok(profile);
    }
}
