package com.bookmyevent.event_service.requestDto;

import com.bookmyevent.event_service.enums.TicketTypeEnum;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TicketTypeRequestDto {
    private TicketTypeEnum type;
    private BigDecimal price;
    private Integer seatCount;
    private Integer availableSeatCount;
}
