package com.bookmyevent.booking_service.entity;

import com.bookmyevent.booking_service.enums.TicketTypeEnum;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Ticket {
    @Enumerated(EnumType.STRING)
    private TicketTypeEnum ticketType;
    private int quantity;
    private BigDecimal price;
}
