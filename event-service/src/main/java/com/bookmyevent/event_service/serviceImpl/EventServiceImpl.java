package com.bookmyevent.event_service.serviceImpl;

import com.bookmyevent.event_service.entity.Event;
import com.bookmyevent.event_service.requestDto.CreateEventRequestDto;
import com.bookmyevent.event_service.responseDto.EventResponseDto;
import com.bookmyevent.event_service.service.EventService;
import org.springframework.stereotype.Service;

@Service
public class EventServiceImpl implements EventService {
    @Override
    public EventResponseDto createEvent(CreateEventRequestDto requestDto) {

        return null;
    }

    private void validateEventRequestDto(CreateEventRequestDto requestDto) {

    }
}
