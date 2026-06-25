package com.bookmyevent.booking_service.responseDto;

import com.bookmyevent.booking_service.entity.Ticket;
import com.bookmyevent.booking_service.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponseDto {
    private Long id;
    private Long userId;
    private Long eventId;
    private List<TicketResponseDto> tickets;
    private BookingStatus status;
    private BigDecimal totalAmount;
    private String paymentReference;
    private LocalDateTime createdAt;
}
