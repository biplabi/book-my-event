package com.bookmyevent.event_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "venue")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Venue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Integer seatCapacity;
    @Embedded
    private Address address;
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if(null == createdAt) {
            createdAt = LocalDateTime.now();
        }
    }
}
