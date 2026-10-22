package com.bookmyevent.event_service.responseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageUploadResponseDto {
    /** Signed MinIO link the browser PUTs the file to. Expires after a few minutes. */
    private String uploadUrl;
    /** Path of the file inside the bucket; send this back when creating the artist. */
    private String imageKey;
    /** Public link to the image once uploaded (for previews). */
    private String imageUrl;
}
