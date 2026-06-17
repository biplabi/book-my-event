package com.bookmyevent.event_service.controller;

import com.bookmyevent.event_service.requestDto.CreateVenueRequestDto;
import com.bookmyevent.event_service.responseDto.ApiResponse;
import com.bookmyevent.event_service.responseDto.VenueResponseDto;
import com.bookmyevent.event_service.service.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/venue")
public class VenueController {

    @Autowired
    private VenueService venueService;

    @PostMapping("/")
    public ResponseEntity<ApiResponse<VenueResponseDto>> createVenue(@RequestBody CreateVenueRequestDto requestDto) {
        VenueResponseDto responseDto = venueService.createVenue(requestDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Venue created successfully!", responseDto));
    }
}
