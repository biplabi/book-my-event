package com.bookmyevent.booking_service.serviceImpl;

import com.bookmyevent.booking_service.entity.Booking;
import com.bookmyevent.booking_service.entity.Ticket;
import com.bookmyevent.booking_service.requestDto.BookingRequestDto;
import com.bookmyevent.booking_service.responseDto.BookingResponseDto;
import com.bookmyevent.booking_service.security.JwtUtil;
import com.bookmyevent.booking_service.service.BookingService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;

public class BookingServiceImpl implements BookingService {

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public BookingResponseDto bookEvent(BookingRequestDto requestDto, Long userId) {
        validateBookingRequestDto(requestDto);
        Booking booking = Booking.builder()
                .userId(userId)
                .eventId(requestDto.getEventId())
                .tickets(requestDto.getTickets().stream()
                        .map(ticketDto -> modelMapper.map(ticketDto, Ticket.class))
                        .toList()
                )
                .totalAmount(BigDecimal.valueOf(requestDto.getTickets().stream()
                        .mapToInt(ticketDto -> ticketDto.getPrice().intValue())
                        .sum()))
                .paymentReference(null)
                .build();

        return null;
    }

    private void validateBookingRequestDto(BookingRequestDto requestDto) {
//        boolean isValidEvent =
    }
}
