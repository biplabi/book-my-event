package com.bookmyevent.event_service.service;

import com.bookmyevent.event_service.enums.EventStatus;
import com.bookmyevent.event_service.requestDto.CreateEventRequestDto;
import com.bookmyevent.event_service.responseDto.EventResponseDto;

import java.util.List;

public interface EventService {
    EventResponseDto createEvent(CreateEventRequestDto requestDto);

    /** What users can browse: published events only. */
    List<EventResponseDto> getPublishedEvents();

    /** Throws ResourceNotFoundException unless the event is published, so drafts stay hidden. */
    EventResponseDto getPublishedEventById(Long id);

    /** Admin view: events of every status. */
    List<EventResponseDto> getAllEvents();

    /** Admin view: the event whatever its status. */
    EventResponseDto getEventById(Long id);

    EventResponseDto updateEventStatus(Long id, EventStatus status);
}
