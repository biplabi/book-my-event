package com.bookmyevent.booking_service.feign;

import com.bookmyevent.booking_service.requestDto.PaymentRequestDto;
import com.bookmyevent.booking_service.responseDto.ApiResponse;
import com.bookmyevent.booking_service.responseDto.PaymentResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "payment-service", url = "${payment.service.url}")
public interface PaymentServiceClient {
    @PostMapping("/payment/initiate")
    ApiResponse<PaymentResponseDto> initiatePayment(PaymentRequestDto requestDto);
}
