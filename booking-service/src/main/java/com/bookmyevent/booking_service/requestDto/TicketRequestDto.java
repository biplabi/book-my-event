package com.bookmyevent.booking_service.requestDto;

import com.bookmyevent.booking_service.enums.TicketTypeEnum;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketRequestDto {
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Ticket type is required!")
    private TicketTypeEnum ticketType;
    @NotNull(message = "No of tickets required!")
    private int quantity;
    private BigDecimal price;
}
