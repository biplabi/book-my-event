package com.bookmyevent.event_service.service;

import com.bookmyevent.event_service.requestDto.CreateVenueRequestDto;
import com.bookmyevent.event_service.responseDto.ApiResponse;
import com.bookmyevent.event_service.responseDto.VenueResponseDto;

import java.util.List;

public interface VenueService {
    VenueResponseDto createVenue(CreateVenueRequestDto requestDto);
    List<VenueResponseDto> getAllVenue();
}
