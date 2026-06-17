package com.bookmyevent.event_service.service;

import com.bookmyevent.event_service.requestDto.CreateVenueRequestDto;
import com.bookmyevent.event_service.responseDto.VenueResponseDto;

public interface VenueService {
    VenueResponseDto createVenue(CreateVenueRequestDto requestDto);
}
