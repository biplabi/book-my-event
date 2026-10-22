package com.bookmyevent.event_service.serviceImpl;

import com.bookmyevent.event_service.requestDto.ImageUploadRequestDto;
import com.bookmyevent.event_service.responseDto.ImageUploadResponseDto;
import com.bookmyevent.event_service.service.ImageStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;

import java.time.Duration;
import java.util.UUID;

@Service
public class ImageStorageServiceImpl implements ImageStorageService {

    private static final Duration UPLOAD_LINK_VALIDITY = Duration.ofMinutes(5);

    @Autowired
    private S3Presigner s3Presigner;
    @Value("${storage.bucket}")
    private String bucket;
    @Value("${storage.public-base-url}")
    private String publicBaseUrl;

    @Override
    public ImageUploadResponseDto createArtistImageUpload(ImageUploadRequestDto requestDto) {
        // "image/png" -> "png". The server picks the name so uploads can't overwrite each other.
        String extension = requestDto.getContentType().substring("image/".length());
        String key = "artists/" + UUID.randomUUID() + "." + extension;

        // Content type and length are part of the signature, so MinIO rejects
        // any upload whose type or size differs from what was validated here.
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(requestDto.getContentType())
                .contentLength(requestDto.getSizeBytes())
                .build();

        PresignedPutObjectRequest presigned = s3Presigner.presignPutObject(presign -> presign
                .signatureDuration(UPLOAD_LINK_VALIDITY)
                .putObjectRequest(putRequest));

        return new ImageUploadResponseDto(presigned.url().toString(), key, toPublicUrl(key));
    }

    @Override
    public String toPublicUrl(String imageKey) {
        return imageKey == null ? null : publicBaseUrl + "/" + imageKey;
    }
}
