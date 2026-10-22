package com.bookmyevent.event_service.requestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    // Only keys handed out by POST /artist/image-upload-url are accepted.
    @Pattern(regexp = "^artists/[0-9a-f-]{36}\\.(jpeg|png|webp)$", message = "Invalid image!")
    private String imageKey;
    private String country;
}
