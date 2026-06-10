package com.bookmyevent.event_service.service;

import com.bookmyevent.event_service.requestDto.CreateEventRequestDto;
import com.bookmyevent.event_service.responseDto.EventResponseDto;

public interface EventService {
    EventResponseDto createEvent(CreateEventRequestDto requestDto);
}
