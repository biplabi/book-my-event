package com.bookmyevent.event_service.service;

import com.bookmyevent.event_service.enums.EventStatus;
import com.bookmyevent.event_service.requestDto.CreateEventRequestDto;
import com.bookmyevent.event_service.responseDto.EventResponseDto;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface EventService {
    EventResponseDto createEvent(CreateEventRequestDto requestDto);

    /** Admins see every event; everyone else only sees published ones. */
    List<EventResponseDto> getAllEvents(boolean includeUnpublished);

    EventResponseDto getEventById(Long id);

    EventResponseDto updateEventStatus(Long id, EventStatus status);
}
