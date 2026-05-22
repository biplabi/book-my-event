package com.bookmyevent.user_service.service;

import com.bookmyevent.user_service.entity.User;
import com.bookmyevent.user_service.repository.UserRepository;
import com.bookmyevent.user_service.requestDto.PasswordChangeRequestDto;
import com.bookmyevent.user_service.responseDto.UserProfileResponseDto;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserProfileResponseDto getUserProfile(String username) {
        Optional<User> userOptional= userRepository.findByEmail(username);
        User savedUser = userOptional.orElseThrow();

        return modelMapper.map(savedUser, UserProfileResponseDto.class);
    }

    @Transactional
    public String changePassword(String username, PasswordChangeRequestDto requestDto) {

        User user = userRepository.findByEmail(username).orElseThrow();
        boolean isMatch = passwordEncoder.matches(requestDto.getCurrentPassword(), user.getPassword());
        if(!isMatch) {
            throw new RuntimeException("Current password does not match with your existing password!");
        }

        if (requestDto.getCurrentPassword().equals(requestDto.getNewPassword())) {
            throw new IllegalArgumentException("New password cannot be the same as your current password");
        }

        if (!requestDto.getNewPassword().equals(requestDto.getNewPasswordRetype())) {
            throw new IllegalArgumentException("New password and retype password do not match");
        }
        user.setPassword(passwordEncoder.encode(requestDto.getNewPassword()));
        userRepository.save(user);
        return "Password changed successfully!";
    }
}
