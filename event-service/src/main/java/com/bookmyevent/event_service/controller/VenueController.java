package com.bookmyevent.event_service.controller;

import com.bookmyevent.event_service.requestDto.CreateVenueRequestDto;
import com.bookmyevent.event_service.responseDto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/venue")
public class VenueController {
    @PostMapping("/")
    public ResponseEntity<ApiResponse<String>> createVenue(@RequestBody CreateVenueRequestDto requestDto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Venue created successfully!", null));
    }
}
