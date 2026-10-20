package com.bookmyevent.payment_service.service;

import com.bookmyevent.payment_service.requestDto.PaymentRequestDto;
import com.bookmyevent.payment_service.responseDto.PaymentResponseDto;

public interface PaymentService {
    PaymentResponseDto initiatePayment(PaymentRequestDto requestDto);
}
