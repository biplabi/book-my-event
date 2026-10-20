package com.bookmyevent.payment_service.controller;

import com.bookmyevent.payment_service.requestDto.PaymentRequestDto;
import com.bookmyevent.payment_service.responseDto.ApiResponse;
import com.bookmyevent.payment_service.responseDto.PaymentResponseDto;
import com.bookmyevent.payment_service.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> initiatePayment(@RequestBody @Valid PaymentRequestDto requestDto) {
        PaymentResponseDto responseDto = paymentService.initiatePayment(requestDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Payment processed successfully!", responseDto));
    }
}
