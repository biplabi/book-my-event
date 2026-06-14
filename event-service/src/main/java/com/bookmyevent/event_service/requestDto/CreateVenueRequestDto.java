package com.bookmyevent.event_service.requestDto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateVenueRequestDto {
    @NotBlank(message = "Name is required!")
    private String name;
    @NotBlank(message = "Seat capacity is required!")
    private Integer seatCapacity;
    @NotNull(message = "Address is required!")
    @Valid
    private createAddressRequestDto addressDto;
}
