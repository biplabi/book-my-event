package com.bookmyevent.booking_service.service;

import com.bookmyevent.booking_service.requestDto.BookingRequestDto;
import com.bookmyevent.booking_service.responseDto.BookingResponseDto;

import java.util.List;

public interface BookingService {
    BookingResponseDto bookEvent(BookingRequestDto requestDto, Long userId);

    /** Every booking, newest first. Admin only. */
    List<BookingResponseDto> getAllBookings();
}
