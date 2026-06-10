package com.bookmyevent.event_service.requestDto;

import com.bookmyevent.event_service.enums.TicketTypeEnum;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TicketTypeRequestDto {
    @NotNull(message = "Ticket type is required!")
    private TicketTypeEnum type;
    @DecimalMin(value = "0", message = "Price can not be negative!")
    @NotNull(message = "Price is required!")
    private BigDecimal price;
    @NotNull(message = "Seat count is required!")
    private Integer seatCount;
}
