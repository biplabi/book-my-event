package com.bookmyevent.booking_service.serviceImpl;

import com.bookmyevent.booking_service.entity.Booking;
import com.bookmyevent.booking_service.entity.Ticket;
import com.bookmyevent.booking_service.exception.ResourceNotFoundException;
import com.bookmyevent.booking_service.feign.EventServiceClient;
import com.bookmyevent.booking_service.requestDto.BookingRequestDto;
import com.bookmyevent.booking_service.responseDto.ApiResponse;
import com.bookmyevent.booking_service.responseDto.BookingResponseDto;
import com.bookmyevent.booking_service.responseDto.EventResponseDto;
import com.bookmyevent.booking_service.service.BookingService;
import feign.FeignException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import javax.naming.ServiceUnavailableException;
import java.math.BigDecimal;

public class BookingServiceImpl implements BookingService {

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private EventServiceClient eventServiceClient;

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
        try{
            ApiResponse<EventResponseDto> response = eventServiceClient.getEventById(requestDto.getEventId());
            if(null == response || null == response.getData()){
                throw new ResourceNotFoundException("Event not found with id: " + requestDto.getEventId());
            }
        } catch (FeignException.NotFound ex) {
            throw new ResourceNotFoundException("Event not found with id: " + requestDto.getEventId());
        }
    }
}
