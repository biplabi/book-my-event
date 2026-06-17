package com.bookmyevent.event_service.serviceImpl;

import com.bookmyevent.event_service.entity.Artist;
import com.bookmyevent.event_service.repository.ArtistRepository;
import com.bookmyevent.event_service.requestDto.CreateArtistRequestDto;
import com.bookmyevent.event_service.responseDto.ArtistResponseDto;
import com.bookmyevent.event_service.service.ArtistService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@Service
public class ArtistServiceImpl implements ArtistService {

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ArtistRepository artistRepository;

    @Override
    public ArtistResponseDto createArtist(CreateArtistRequestDto requestDto) {
        Optional<Artist> artistOptional = artistRepository.findByStageName(requestDto.getStageName());

        if(artistOptional.isPresent()) {
            throw new RuntimeException("Duplicate artist found!");
        }
        Artist artist = modelMapper.map(requestDto, Artist.class);
        Artist savedArtist = artistRepository.save(artist);

        return modelMapper.map(savedArtist, ArtistResponseDto.class);
    }

    @Override
    public List<ArtistResponseDto> getAllArtists() {
        List<Artist> artistList =  artistRepository.findAll();
        return artistList.stream()
                .map(artist -> modelMapper.map(artist, ArtistResponseDto.class))
                .toList();
    }
}
