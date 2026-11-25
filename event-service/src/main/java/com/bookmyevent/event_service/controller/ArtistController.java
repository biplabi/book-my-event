package com.bookmyevent.event_service.controller;

import com.bookmyevent.event_service.responseDto.ApiResponse;
import com.bookmyevent.event_service.responseDto.ArtistResponseDto;
import com.bookmyevent.event_service.service.ArtistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Artist profiles are the same for everyone. Changes go through AdminArtistController. */
@RestController
@RequestMapping("/artists")
public class ArtistController {

    @Autowired
    private ArtistService artistService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ArtistResponseDto>>> getAllArtists() {
        List<ArtistResponseDto> artistList = artistService.getAllArtists();

        return ResponseEntity.ok(new ApiResponse<>(true, "Artist list fetch successfully!", artistList));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ArtistResponseDto>> getArtist(@PathVariable Long id) {
        ArtistResponseDto artist = artistService.getArtist(id);

        return ResponseEntity.ok(new ApiResponse<>(true, "Artist fetched successfully!", artist));
    }
}
