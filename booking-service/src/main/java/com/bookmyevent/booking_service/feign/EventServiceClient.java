package com.bookmyevent.booking_service.feign;

import com.bookmyevent.booking_service.responseDto.ApiResponse;
import com.bookmyevent.booking_service.responseDto.EventResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "event-service", url = "${event.service.url}")
public interface EventServiceClient {

    @GetMapping("/event/{id}")
    ApiResponse<EventResponseDto> getEventById(@PathVariable Long id);
}
