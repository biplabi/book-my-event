package com.bookmyevent.payment_service.requestDto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequestDto {
    @NotNull(message = "Booking id is required")
    private Long bookingId;
    @NotNull(message = "Booking amount is required")
    @Positive(message = "Booking amount must be greater than zero")
    private BigDecimal bookingAmount;
    @NotNull(message = "User id is required")
    private Long userId;
}
