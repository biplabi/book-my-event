package com.bookmyevent.event_service.controller;

import com.bookmyevent.event_service.responseDto.ApiResponse;
import com.bookmyevent.event_service.responseDto.EventResponseDto;
import com.bookmyevent.event_service.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** What users can see. Admin actions live in AdminEventController. */
@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponseDto>>> getAllEvents() {
        List<EventResponseDto> eventList = eventService.getPublishedEvents();

        return ResponseEntity.ok(new ApiResponse<>(true, "Events fetched successfully!", eventList));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponseDto>> getEventById(@PathVariable Long id) {
        EventResponseDto responseDto = eventService.getPublishedEventById(id);

        return ResponseEntity.ok(new ApiResponse<>(true, "Event fetched with id: " + id, responseDto));
    }
}
