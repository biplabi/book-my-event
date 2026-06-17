package com.bookmyevent.event_service.responseDto;

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
    private AddressResponseDto address;
}
