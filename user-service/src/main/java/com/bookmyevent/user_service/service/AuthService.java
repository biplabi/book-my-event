package com.bookmyevent.user_service.service;

import com.bookmyevent.user_service.entity.User;
import com.bookmyevent.user_service.repository.UserRepository;
import com.bookmyevent.user_service.requestDto.LoginUserRequestDto;
import com.bookmyevent.user_service.requestDto.RegisterUserRequestDto;
import com.bookmyevent.user_service.responseDto.LoginUserResponseDto;
import com.bookmyevent.user_service.responseDto.RegisterUserResponseDto;
import com.bookmyevent.user_service.security.JwtUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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
    private CustomUserDetailsService customUserDetailsServcie;

    public RegisterUserResponseDto registerUser(RegisterUserRequestDto requestDto) {

        User user = modelMapper.map(requestDto, User.class);
        user.setPassword(passwordEncoder.encode(requestDto.getPassword()));
        user.setRole("ROLE_USER");

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
