package com.bookmyevent.event_service.service;

import com.bookmyevent.event_service.requestDto.CreateArtistRequestDto;
import com.bookmyevent.event_service.responseDto.ArtistResponseDto;

public interface ArtistService {
    ArtistResponseDto createArtist(CreateArtistRequestDto requestDto);
}
