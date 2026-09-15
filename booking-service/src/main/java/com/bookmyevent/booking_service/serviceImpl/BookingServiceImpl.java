package com.bookmyevent.booking_service.serviceImpl;

import com.bookmyevent.booking_service.entity.Booking;
import com.bookmyevent.booking_service.entity.Ticket;
import com.bookmyevent.booking_service.enums.BookingStatus;
import com.bookmyevent.booking_service.enums.TicketTypeEnum;
import com.bookmyevent.booking_service.exception.ResourceNotFoundException;
import com.bookmyevent.booking_service.feign.EventServiceClient;
import com.bookmyevent.booking_service.repository.BookingRepository;
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
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private EventServiceClient eventServiceClient;
    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public BookingResponseDto bookEvent(BookingRequestDto requestDto, Long userId) {
        EventResponseDto event = validateBookingRequestDto(requestDto);
        Booking booking = Booking.builder()
                .userId(userId)
                .eventId(requestDto.getEventId())
                .tickets(requestDto.getTickets().stream()
                        .map(ticketDto -> modelMapper.map(ticketDto, Ticket.class))
                        .toList()
                )
                .totalAmount(calculateTotalAmount(requestDto.getTickets(), event))
                .paymentReference(null)
                .status(BookingStatus.PAYMENT_PENDING)
                .build();
        booking = bookingRepository.save(booking);

        //bookingClient.initiatePayment(booking);

        return null;
    }

    private EventResponseDto validateBookingRequestDto(BookingRequestDto requestDto) {
        try{
            EventResponseDto event = eventServiceClient.getEventById(requestDto.getEventId()).getData();
            if(null == event){
                throw new ResourceNotFoundException("Event not found with id: " + requestDto.getEventId());
            }
            if(null != event.getTicketTypes() && null != requestDto.getTickets()){
                Map<TicketTypeEnum, Integer> availableTypes = event.getTicketTypes().stream()
                        .collect(Collectors.toMap(TicketTypeResponseDto::getType, TicketTypeResponseDto::getAvailableSeatCount));

                for(TicketRequestDto ticket : requestDto.getTickets()) {
                    if(ticket.getQuantity() > availableTypes.get(ticket.getTicketType())) {
                        throw new ResourceNotFoundException("Requested tickets are not available of type: " + ticket.getTicketType());
                    }
                }
            }
            return event;
        } catch (FeignException.NotFound ex) {
            throw new ResourceNotFoundException("Event not found with id: " + requestDto.getEventId());
        }
    }

    private BigDecimal calculateTotalAmount(List<TicketRequestDto> tickets, EventResponseDto event) {
        Map<TicketTypeEnum, BigDecimal> ticketPricing = event.getTicketTypes().stream()
                .collect(Collectors.toMap(TicketTypeResponseDto::getType, TicketTypeResponseDto::getPrice));

        return tickets.stream()
                .map(t -> ticketPricing.get(t.getTicketType())
                        .multiply(BigDecimal.valueOf(t.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
