package com.bookmyevent.event_service.responseDto;

import com.bookmyevent.event_service.enums.TicketTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketTypeResponseDto {
    private TicketTypeEnum type;
    private BigDecimal price;
    private Integer seatCount;
    private Integer availableSeatCount;
}
