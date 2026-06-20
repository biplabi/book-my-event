package com.bookmyevent.event_service.service;

import com.bookmyevent.event_service.requestDto.CreateEventRequestDto;
import com.bookmyevent.event_service.responseDto.EventResponseDto;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface EventService {
    EventResponseDto createEvent(CreateEventRequestDto requestDto);

    List<EventResponseDto> getAllEvents();

    EventResponseDto getEventById(Long id);
}
