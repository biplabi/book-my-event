package com.bookmyevent.event_service.requestDto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Every field is optional: a field that isn't sent (or is null) keeps its current value.
 * Send "" for bio or country to clear it.
 */
@Data
public class UpdateArtistRequestDto {
    @Pattern(regexp = ".*\\S.*", message = "Stage name can't be blank!")
    private String stageName;
    @Pattern(regexp = ".*\\S.*", message = "Genre can't be blank!")
    private String genre;
    @Size(max = 1000, message = "The bio must be at most 1000 characters!")
    private String bio;
    private String country;
    /** New photo from POST /artist/image-upload-url. Leave empty to keep the current one. */
    @Pattern(regexp = "^artists/[0-9a-f-]{36}\\.(jpeg|png|webp)$", message = "Invalid image!")
    private String imageKey;
    /** Drop the current photo. Ignored when a new imageKey is given. */
    private boolean removeImage;
}
