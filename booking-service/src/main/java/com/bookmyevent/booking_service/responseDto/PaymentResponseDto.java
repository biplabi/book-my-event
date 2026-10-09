package com.bookmyevent.booking_service.responseDto;

import lombok.Data;

@Data
public class PaymentResponseDto {
    private String transactionId;
    private String paymentStatus;
}
