package com.bookmyevent.user_service.service;

import com.bookmyevent.user_service.entity.User;
import com.bookmyevent.user_service.repository.UserRepository;
import com.bookmyevent.user_service.responseDto.UserProfileResponseDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;

    public UserProfileResponseDto getUserProfile(String username) {
        Optional<User> userOptional= userRepository.findByEmail(username);
        User savedUser = userOptional.orElseThrow();

        return modelMapper.map(savedUser, UserProfileResponseDto.class);
    }
}
