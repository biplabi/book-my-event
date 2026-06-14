package com.bookmyevent.event_service.controller;

import com.bookmyevent.event_service.requestDto.CreateArtistRequestDto;
import com.bookmyevent.event_service.responseDto.ApiResponse;
import com.bookmyevent.event_service.responseDto.ArtistResponseDto;
import com.bookmyevent.event_service.service.ArtistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/artist")
public class ArtistController {

    @Autowired
    private ArtistService artistService;

    @PostMapping("/")
    public ResponseEntity<ApiResponse<ArtistResponseDto>> createArtist(@RequestBody @Valid CreateArtistRequestDto requestDto) {
        ArtistResponseDto responseDto = artistService.createArtist(requestDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Artist saved successfully!", responseDto));
    }
}
