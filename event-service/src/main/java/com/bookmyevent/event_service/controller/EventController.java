package com.bookmyevent.event_service.controller;

import com.bookmyevent.event_service.requestDto.CreateEventRequestDto;
import com.bookmyevent.event_service.responseDto.ApiResponse;
import com.bookmyevent.event_service.responseDto.EventResponseDto;
import com.bookmyevent.event_service.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/event")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping("/")
    public ResponseEntity<ApiResponse<EventResponseDto>> createEvent(@RequestBody @Valid CreateEventRequestDto requestDto) {
        EventResponseDto responseDto = eventService.createEvent(requestDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Event created successfully!", responseDto));
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<EventResponseDto>>> getAllEvents() {
        List<EventResponseDto> eventList = eventService.getAllEvents();

        return ResponseEntity.ok(new ApiResponse<>(true, "Events fetched successfully!", eventList));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponseDto>> getEventById(@PathVariable Long id) {
        EventResponseDto responseDto = eventService.getEventById(id);

        return ResponseEntity.ok(new ApiResponse<>(true, "Event fetched with is: " + id, responseDto));
    }
}
