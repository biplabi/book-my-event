package com.bookmyevent.event_service.service;

import com.bookmyevent.event_service.entity.Artist;
import com.bookmyevent.event_service.requestDto.CreateArtistRequestDto;
import com.bookmyevent.event_service.requestDto.UpdateArtistRequestDto;
import com.bookmyevent.event_service.responseDto.ArtistResponseDto;

import java.util.List;
import java.util.Optional;

public interface ArtistService {
    ArtistResponseDto createArtist(CreateArtistRequestDto requestDto);
    List<ArtistResponseDto> getAllArtists();
    ArtistResponseDto getArtist(Long id);
    ArtistResponseDto updateArtist(Long id, UpdateArtistRequestDto requestDto);

    /** Entity to DTO, turning the stored image key into a public image URL. */
    ArtistResponseDto toResponseDto(Artist artist);
}

