package com.bookmyevent.booking_service.service;

import com.bookmyevent.booking_service.entity.User;
import com.bookmyevent.booking_service.repository.UserRepository;
import com.bookmyevent.booking_service.requestDto.LoginUserRequestDto;
import com.bookmyevent.booking_service.requestDto.RegisterUserRequestDto;
import com.bookmyevent.booking_service.responseDto.LoginUserResponseDto;
import com.bookmyevent.booking_service.responseDto.RegisterUserResponseDto;
import com.bookmyevent.booking_service.security.JwtUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private CustomUserDetailsServcie customUserDetailsServcie;

    public RegisterUserResponseDto registerUser(RegisterUserRequestDto requestDto) {

        User user = modelMapper.map(requestDto, User.class);
        user.setPassword(passwordEncoder.encode(requestDto.getPassword()));

        User savedUser = userRepository.save(user);

        return RegisterUserResponseDto.builder()
                .id(savedUser.getId())
                .firstName(savedUser.getFirstName())
                .email(savedUser.getEmail())
                .build();
    }

    public LoginUserResponseDto login(LoginUserRequestDto requestDto) {
        String username = requestDto.getEmail();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        username,
                        requestDto.getPassword()
                )
        );
        String token = jwtUtil.generateToken(customUserDetailsServcie.loadUserByUsername(username));
        return LoginUserResponseDto.builder()
                .token(token)
                .build();
    }
}
