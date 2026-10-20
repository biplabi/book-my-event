package com.bookmyevent.payment_service.serviceImpl;

import com.bookmyevent.payment_service.entity.Payment;
import com.bookmyevent.payment_service.enums.PaymentStatus;
import com.bookmyevent.payment_service.repository.PaymentRepository;
import com.bookmyevent.payment_service.requestDto.PaymentRequestDto;
import com.bookmyevent.payment_service.responseDto.PaymentResponseDto;
import com.bookmyevent.payment_service.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public PaymentResponseDto initiatePayment(PaymentRequestDto requestDto) {
        // Don't charge twice if booking-service retries an already paid booking
        Optional<Payment> existingPayment = paymentRepository
                .findByBookingIdAndPaymentStatus(requestDto.getBookingId(), PaymentStatus.SUCCESS);
        if(existingPayment.isPresent()) {
            return toResponseDto(existingPayment.get());
        }

        Payment payment = Payment.builder()
                .transactionId(UUID.randomUUID().toString())
                .bookingId(requestDto.getBookingId())
                .userId(requestDto.getUserId())
                .amount(requestDto.getBookingAmount())
                .paymentStatus(processWithGateway(requestDto))
                .build();
        Payment savedPayment = paymentRepository.save(payment);

        return toResponseDto(savedPayment);
    }

    // Mock gateway until a real payment provider is integrated
    private PaymentStatus processWithGateway(PaymentRequestDto requestDto) {
        return PaymentStatus.SUCCESS;
    }

    private PaymentResponseDto toResponseDto(Payment payment) {
        return new PaymentResponseDto(payment.getTransactionId(), payment.getPaymentStatus().name());
    }
}
