package com.bookmyevent.event_service.entity;

import com.bookmyevent.event_service.enums.TicketTypeEnum;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.math.BigDecimal;

@Embeddable
public class TicketType {
    @Enumerated(EnumType.STRING)
    private TicketTypeEnum type;
    private BigDecimal price;
    private Integer seatCount;
    private Integer availableSeatCount;
}
