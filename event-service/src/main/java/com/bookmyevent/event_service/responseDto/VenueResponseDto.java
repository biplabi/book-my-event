package com.bookmyevent.event_service.responseDto;

import com.bookmyevent.event_service.entity.Address;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VenueResponseDto {
    private Long id;
    private String name;
    private Integer seatCapacity;
    private Address address;
}
