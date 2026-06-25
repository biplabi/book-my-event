package com.bookmyevent.booking_service.entity;

import com.bookmyevent.booking_service.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "booking")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long eventId;
    @ElementCollection
    @CollectionTable(
            name = "booking_tickets",
            joinColumns = @JoinColumn(name = "booking_id")
    )
    private List<Ticket> tickets;
    @Enumerated(EnumType.STRING)
    private BookingStatus status;
    private BigDecimal totalAmount;
    private String paymentReference;
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();

        if(null == status) {
            status = BookingStatus.CREATED;
        }
    }
}
