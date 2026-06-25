package com.bookmyevent.booking_service.requestDto;

import com.bookmyevent.booking_service.entity.Ticket;
import com.bookmyevent.booking_service.enums.BookingStatus;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingRequestDto {
    @NotNull(message = "User id is required!")
    private Long userId;
    @NotNull(message = "Event id is required!")
    private Long eventId;
    @NotBlank(message = "At least one ticket type details required!")
    @Valid
    private List<TicketRequestDto> tickets;
    @Enumerated(EnumType.STRING)
    private BookingStatus status;
    @NotNull(message = "Total amount is required!")
    private BigDecimal totalAmount;
    @NotNull(message = "Payment reference is required!")
    private String paymentReference;
}
