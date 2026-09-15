package com.bookmyevent.booking_service.serviceImpl;

import com.bookmyevent.booking_service.entity.Booking;
import com.bookmyevent.booking_service.entity.Ticket;
import com.bookmyevent.booking_service.enums.TicketTypeEnum;
import com.bookmyevent.booking_service.exception.ResourceNotFoundException;
import com.bookmyevent.booking_service.feign.EventServiceClient;
import com.bookmyevent.booking_service.requestDto.BookingRequestDto;
import com.bookmyevent.booking_service.requestDto.TicketRequestDto;
import com.bookmyevent.booking_service.responseDto.ApiResponse;
import com.bookmyevent.booking_service.responseDto.BookingResponseDto;
import com.bookmyevent.booking_service.responseDto.EventResponseDto;
import com.bookmyevent.booking_service.responseDto.TicketTypeResponseDto;
import com.bookmyevent.booking_service.service.BookingService;
import feign.FeignException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.Map;
import java.util.stream.Collectors;

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
//                .status()
                .build();

        return null;
    }

    private void validateBookingRequestDto(BookingRequestDto requestDto) {
        try{
            ApiResponse<EventResponseDto> response = eventServiceClient.getEventById(requestDto.getEventId());
            if(null == response || null == response.getData()){
                throw new ResourceNotFoundException("Event not found with id: " + requestDto.getEventId());
            }
            if(null != response.getData().getTicketTypes() && null != requestDto.getTickets()){
                Map<TicketTypeEnum, Integer> availableTypes = response.getData().getTicketTypes().stream()
                        .collect(Collectors.toMap(TicketTypeResponseDto::getType, TicketTypeResponseDto::getAvailableSeatCount));

                for(TicketRequestDto ticket : requestDto.getTickets()) {
                    if(ticket.getQuantity() > availableTypes.get(ticket.getTicketType())) {
                        throw new ResourceNotFoundException("Requested tickets are not available of type: " + ticket.getTicketType());
                    }
                }
            }
        } catch (FeignException.NotFound ex) {
            throw new ResourceNotFoundException("Event not found with id: " + requestDto.getEventId());
        }
    }
}
