package com.bookmyevent.event_service.requestDto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ImageUploadRequestDto {
    @NotBlank(message = "Content type is required!")
    @Pattern(regexp = "^image/(jpeg|png|webp)$", message = "Only JPEG, PNG or WebP images are allowed!")
    private String contentType;
    @NotNull(message = "File size is required!")
    @Positive(message = "File size must be greater than zero!")
    @Max(value = 5 * 1024 * 1024, message = "Image must be at most 5 MB!")
    private Long sizeBytes;
}
