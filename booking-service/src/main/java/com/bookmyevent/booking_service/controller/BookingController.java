package com.bookmyevent.booking_service.controller;

import com.bookmyevent.booking_service.requestDto.BookingRequestDto;
import com.bookmyevent.booking_service.responseDto.BookingResponseDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/booking")
public class BookingController {
    public ResponseEntity<BookingResponseDto> bookEvent(@RequestBody @Valid BookingRequestDto requestDto) {
        return null;
    }
}
