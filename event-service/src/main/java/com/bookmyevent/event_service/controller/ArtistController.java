package com.bookmyevent.event_service.controller;

import com.bookmyevent.event_service.enums.MediaFolder;
import com.bookmyevent.event_service.requestDto.CreateArtistRequestDto;
import com.bookmyevent.event_service.requestDto.ImageUploadRequestDto;
import com.bookmyevent.event_service.requestDto.UpdateArtistRequestDto;
import com.bookmyevent.event_service.responseDto.ApiResponse;
import com.bookmyevent.event_service.responseDto.ArtistResponseDto;
import com.bookmyevent.event_service.responseDto.ImageUploadResponseDto;
import com.bookmyevent.event_service.service.ArtistService;
import com.bookmyevent.event_service.service.StorageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/artist")
public class ArtistController {

    @Autowired
    private ArtistService artistService;
    @Autowired
    private StorageService storageService;

    @PostMapping("/")
    public ResponseEntity<ApiResponse<ArtistResponseDto>> createArtist(@RequestBody @Valid CreateArtistRequestDto requestDto) {
        ArtistResponseDto responseDto = artistService.createArtist(requestDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Artist saved successfully!", responseDto));
    }

    /** Step 1 of adding a photo: get a signed link, then the browser uploads the file straight to MinIO. */
    @PostMapping("/image-upload-url")
    public ResponseEntity<ApiResponse<ImageUploadResponseDto>> createImageUploadUrl(@RequestBody @Valid ImageUploadRequestDto requestDto) {
        ImageUploadResponseDto responseDto = storageService.createImageUpload(MediaFolder.ARTISTS, requestDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Upload URL generated successfully!", responseDto));
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<ArtistResponseDto>>> getAllArtists() {
        List<ArtistResponseDto> artistList = artistService.getAllArtists();

        return ResponseEntity.ok(new ApiResponse<>(true, "Artist list fetch successfully!", artistList));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ArtistResponseDto>> getArtist(@PathVariable Long id) {
        ArtistResponseDto artist = artistService.getArtist(id);

        return ResponseEntity.ok(new ApiResponse<>(true, "Artist list fetch successfully!", artist));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ArtistResponseDto>> updateArtist(@PathVariable Long id, @RequestBody @Valid UpdateArtistRequestDto requestDto) {
        ArtistResponseDto responseDto = artistService.updateArtist(id, requestDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Artist updated successfully!", responseDto));
    }
}
