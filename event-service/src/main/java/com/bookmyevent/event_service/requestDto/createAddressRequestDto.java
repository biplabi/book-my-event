package com.bookmyevent.event_service.requestDto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class createAddressRequestDto {
    @NotBlank(message = "Street can not be blank!")
    private String street;
    @NotBlank(message = "City can not be blank!")
    private String city;
    @NotBlank(message = "Pin code can not be blank!")
    private String pinCode;
    @NotBlank(message = "Country can not be blank!")
    private String country;
}
