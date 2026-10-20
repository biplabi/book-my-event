package com.bookmyevent.payment_service.repository;

import com.bookmyevent.payment_service.entity.Payment;
import com.bookmyevent.payment_service.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBookingIdAndPaymentStatus(Long bookingId, PaymentStatus paymentStatus);
}
