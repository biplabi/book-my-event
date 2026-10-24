package com.bookmyevent.event_service.service;

import com.bookmyevent.event_service.enums.MediaFolder;
import com.bookmyevent.event_service.requestDto.ImageUploadRequestDto;
import com.bookmyevent.event_service.responseDto.ImageUploadResponseDto;

/** Files in MinIO's public bookmyevent-media bucket. */
public interface StorageService {
    /** Reserves a new key in the folder and returns a short-lived signed link the browser uploads to. */
    ImageUploadResponseDto createImageUpload(MediaFolder folder, ImageUploadRequestDto requestDto);

    /** Public URL for a stored key, or null when there is no file. */
    String toPublicUrl(String key);
}
