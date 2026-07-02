package com.bookmyevent.booking_service.service;

import com.bookmyevent.booking_service.requestDto.BookingRequestDto;
import com.bookmyevent.booking_service.responseDto.BookingResponseDto;

public interface BookingService {
    BookingResponseDto bookEvent(BookingRequestDto requestDto, Long userId);
}
