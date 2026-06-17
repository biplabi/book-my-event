package com.bookmyevent.event_service.service;

import com.bookmyevent.event_service.requestDto.CreateArtistRequestDto;
import com.bookmyevent.event_service.responseDto.ArtistResponseDto;

import java.util.List;

public interface ArtistService {
    ArtistResponseDto createArtist(CreateArtistRequestDto requestDto);

    List<ArtistResponseDto> getAllArtists();
}
