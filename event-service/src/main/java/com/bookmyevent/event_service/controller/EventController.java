package com.bookmyevent.event_service.controller;

import com.bookmyevent.event_service.requestDto.CreateEventRequestDto;
import com.bookmyevent.event_service.responseDto.ApiResponse;
import com.bookmyevent.event_service.responseDto.EventResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/event")
public class EventController {
    @PostMapping("/")
    public ResponseEntity<ApiResponse<EventResponseDto>> createEvent(@RequestBody CreateEventRequestDto requestDto) {

        return ResponseEntity.ok(new ApiResponse<>(true, "Event created successfully!", EventResponseDto))
    }
}
