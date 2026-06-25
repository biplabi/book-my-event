package com.bookmyevent.booking_service.responseDto;

import com.bookmyevent.booking_service.enums.TicketTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TicketResponseDto {
    private TicketTypeEnum ticketType;
    private int quantity;
    private BigDecimal price;
}
