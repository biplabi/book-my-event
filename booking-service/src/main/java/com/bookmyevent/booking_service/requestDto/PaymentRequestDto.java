package com.bookmyevent.booking_service.requestDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequestDto {
    private Long bookingId;
    private BigDecimal bookingAmount;
    private Long userId;
}
