package com.bookmyevent.event_service.serviceImpl;

import com.bookmyevent.event_service.entity.Artist;
import com.bookmyevent.event_service.exception.DuplicateResourceException;
import com.bookmyevent.event_service.exception.ResourceNotFoundException;
import com.bookmyevent.event_service.repository.ArtistRepository;
import com.bookmyevent.event_service.requestDto.CreateArtistRequestDto;
import com.bookmyevent.event_service.requestDto.UpdateArtistRequestDto;
import com.bookmyevent.event_service.responseDto.ArtistResponseDto;
import com.bookmyevent.event_service.service.ArtistService;
import com.bookmyevent.event_service.service.ImageStorageService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArtistServiceImpl implements ArtistService {

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ArtistRepository artistRepository;
    @Autowired
    private ImageStorageService imageStorageService;

    @Override
    public ArtistResponseDto createArtist(CreateArtistRequestDto requestDto) {
        Optional<Artist> artistOptional = artistRepository.findByStageName(requestDto.getStageName());

        if(artistOptional.isPresent()) {
            throw new DuplicateResourceException("Duplicate artist found!");
        }
        Artist artist = modelMapper.map(requestDto, Artist.class);
        Artist savedArtist = artistRepository.save(artist);

        return toResponseDto(savedArtist);
    }

    @Override
    public List<ArtistResponseDto> getAllArtists() {
        List<Artist> artistList =  artistRepository.findAll();
        return artistList.stream()
                .map(this::toResponseDto)
                .toList();
    }

    @Override
    public ArtistResponseDto getArtist(Long id) {
       Optional<Artist> artistOptional = artistRepository.findById(id);
       Artist artist = artistOptional.orElseThrow(() ->
               new ResourceNotFoundException("Artist not found with id: " + id + "!"));
       return toResponseDto(artist);
    }

    @Override
    @Transactional
    public ArtistResponseDto updateArtist(Long id, UpdateArtistRequestDto requestDto) {
        Artist artist = artistRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Artist not found with id: " + id + "!"));

        // Fields that weren't sent (null) keep their current value, so nothing is erased by accident.
        if(requestDto.getStageName() != null) {
            // Renaming is fine, but not onto another artist's stage name.
            artistRepository.findByStageName(requestDto.getStageName())
                    .filter(other -> !other.getId().equals(id))
                    .ifPresent(other -> {
                        throw new DuplicateResourceException("Another artist already uses this stage name!");
                    });
            artist.setStageName(requestDto.getStageName());
        }
        if(requestDto.getGenre() != null) {
            artist.setGenre(requestDto.getGenre());
        }
        // Optional fields: an explicit "" clears them.
        if(requestDto.getBio() != null) {
            artist.setBio(blankToNull(requestDto.getBio()));
        }
        if(requestDto.getCountry() != null) {
            artist.setCountry(blankToNull(requestDto.getCountry()));
        }
        if(requestDto.getImageKey() != null) {
            artist.setImageKey(requestDto.getImageKey());
        } else if(requestDto.isRemoveImage()) {
            artist.setImageKey(null);
        }

        return toResponseDto(artistRepository.save(artist));
    }

    private String blankToNull(String value) {
        return value.isBlank() ? null : value;
    }

    @Override
    public ArtistResponseDto toResponseDto(Artist artist) {
        ArtistResponseDto responseDto = modelMapper.map(artist, ArtistResponseDto.class);
        responseDto.setImageUrl(imageStorageService.toPublicUrl(artist.getImageKey()));
        return responseDto;
    }
}
