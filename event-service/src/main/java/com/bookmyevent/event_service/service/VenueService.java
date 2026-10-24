package com.bookmyevent.event_service.service;

import com.bookmyevent.event_service.entity.Venue;
import com.bookmyevent.event_service.requestDto.CreateVenueRequestDto;
import com.bookmyevent.event_service.responseDto.ApiResponse;
import com.bookmyevent.event_service.responseDto.VenueResponseDto;

import java.util.List;

public interface VenueService {
    VenueResponseDto createVenue(CreateVenueRequestDto requestDto);
    List<VenueResponseDto> getAllVenue();

    /** Entity to DTO; also used for the venue inside event responses. */
    VenueResponseDto toResponseDto(Venue venue);
}
