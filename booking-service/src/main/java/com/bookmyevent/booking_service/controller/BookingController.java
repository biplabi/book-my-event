package com.bookmyevent.booking_service.controller;

import com.bookmyevent.booking_service.requestDto.BookingRequestDto;
import com.bookmyevent.booking_service.responseDto.ApiResponse;
import com.bookmyevent.booking_service.responseDto.BookingResponseDto;
import com.bookmyevent.booking_service.security.JwtUtil;
import com.bookmyevent.booking_service.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/booking")
public class BookingController {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponseDto>> bookEvent(
            @RequestBody @Valid BookingRequestDto requestDto,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);

        BookingResponseDto responseDto = bookingService.bookEvent(requestDto, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Event booked successfully.", responseDto));
    }
}
