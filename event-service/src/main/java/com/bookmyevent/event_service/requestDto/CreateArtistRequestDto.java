package com.bookmyevent.event_service.requestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateArtistRequestDto {
    @NotBlank(message = "Stage name is required!")
    private String stageName;
    @NotBlank(message = "Genre is required!")
    private String genre;
    @Size(max = 1000, message = "The bio must be at most 1000 characters!")
    private String bio;
    @Size(max = 2048, message = "The image url is too long!")
    private String imageUrl;
    private String country;
}
