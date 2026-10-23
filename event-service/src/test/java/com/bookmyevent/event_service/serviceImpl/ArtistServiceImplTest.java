package com.bookmyevent.event_service.serviceImpl;

import com.bookmyevent.event_service.entity.Artist;
import com.bookmyevent.event_service.exception.DuplicateResourceException;
import com.bookmyevent.event_service.repository.ArtistRepository;
import com.bookmyevent.event_service.requestDto.UpdateArtistRequestDto;
import com.bookmyevent.event_service.service.ImageStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ArtistServiceImplTest {

    @Mock
    private ArtistRepository artistRepository;
    @Mock
    private ImageStorageService imageStorageService;
    @Spy
    private ModelMapper modelMapper = new ModelMapper();
    @InjectMocks
    private ArtistServiceImpl artistService;

    private Artist artist;

    @BeforeEach
    void setUp() {
        artist = Artist.builder()
                .id(1L)
                .stageName("Prateek Kuhad")
                .genre("Indie folk")
                .bio("Singer-songwriter from Jaipur.")
                .country("India")
                .imageKey("artists/3f9a2c1e-8b7d-4e6f-9a0b-1c2d3e4f5a6b.png")
                .build();
        when(artistRepository.findById(1L)).thenReturn(Optional.of(artist));
    }

    @Test
    void fieldsNotSentKeepTheirValues() {
        when(artistRepository.save(any(Artist.class))).thenAnswer(call -> call.getArgument(0));
        UpdateArtistRequestDto requestDto = new UpdateArtistRequestDto();
        requestDto.setBio("New bio.");

        artistService.updateArtist(1L, requestDto);

        assertThat(artist.getBio()).isEqualTo("New bio.");
        assertThat(artist.getStageName()).isEqualTo("Prateek Kuhad");
        assertThat(artist.getGenre()).isEqualTo("Indie folk");
        assertThat(artist.getCountry()).isEqualTo("India");
        assertThat(artist.getImageKey()).isEqualTo("artists/3f9a2c1e-8b7d-4e6f-9a0b-1c2d3e4f5a6b.png");
    }

    @Test
    void emptyStringClearsOptionalFields() {
        when(artistRepository.save(any(Artist.class))).thenAnswer(call -> call.getArgument(0));
        UpdateArtistRequestDto requestDto = new UpdateArtistRequestDto();
        requestDto.setBio("");
        requestDto.setCountry("  ");

        artistService.updateArtist(1L, requestDto);

        assertThat(artist.getBio()).isNull();
        assertThat(artist.getCountry()).isNull();
        assertThat(artist.getStageName()).isEqualTo("Prateek Kuhad");
    }

    @Test
    void removeImageDropsThePhoto() {
        when(artistRepository.save(any(Artist.class))).thenAnswer(call -> call.getArgument(0));
        UpdateArtistRequestDto requestDto = new UpdateArtistRequestDto();
        requestDto.setRemoveImage(true);

        artistService.updateArtist(1L, requestDto);

        assertThat(artist.getImageKey()).isNull();
        assertThat(artist.getBio()).isEqualTo("Singer-songwriter from Jaipur.");
    }

    @Test
    void renamingOntoAnotherArtistIsRejected() {
        Artist other = Artist.builder().id(2L).stageName("Ritviz").build();
        when(artistRepository.findByStageName("Ritviz")).thenReturn(Optional.of(other));
        UpdateArtistRequestDto requestDto = new UpdateArtistRequestDto();
        requestDto.setStageName("Ritviz");

        assertThatThrownBy(() -> artistService.updateArtist(1L, requestDto))
                .isInstanceOf(DuplicateResourceException.class);
        assertThat(artist.getStageName()).isEqualTo("Prateek Kuhad");
    }
}
