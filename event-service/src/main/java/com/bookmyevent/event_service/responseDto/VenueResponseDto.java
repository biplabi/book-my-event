package com.bookmyevent.event_service.responseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VenueResponseDto {
    private Long id;
    private String name;
    private Integer seatCapacity;
    private AddressResponseDto address;
    private LocalDateTime createdAt;
}
