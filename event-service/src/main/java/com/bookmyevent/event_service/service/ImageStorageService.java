package com.bookmyevent.event_service.service;

import com.bookmyevent.event_service.requestDto.ImageUploadRequestDto;
import com.bookmyevent.event_service.responseDto.ImageUploadResponseDto;

public interface ImageStorageService {
    /** Reserves a new key under artists/ and returns a short-lived signed upload link for it. */
    ImageUploadResponseDto createArtistImageUpload(ImageUploadRequestDto requestDto);

    /** Public URL for a stored key, or null when there is no image. */
    String toPublicUrl(String imageKey);
}
