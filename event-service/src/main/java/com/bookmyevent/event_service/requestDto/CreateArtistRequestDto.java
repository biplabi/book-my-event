package com.bookmyevent.event_service.requestDto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateArtistRequestDto {
    @NotBlank(message = "Stage name is required!")
    private String stageName;
    @NotBlank(message = "Genre is required!")
    private String genre;
    private String bio;
    private String imageUrl;
    private String country;
}
