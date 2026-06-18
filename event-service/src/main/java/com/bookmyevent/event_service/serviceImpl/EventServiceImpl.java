package com.bookmyevent.event_service.serviceImpl;

import com.bookmyevent.event_service.entity.Artist;
import com.bookmyevent.event_service.entity.Event;
import com.bookmyevent.event_service.entity.TicketType;
import com.bookmyevent.event_service.entity.Venue;
import com.bookmyevent.event_service.repository.ArtistRepository;
import com.bookmyevent.event_service.repository.EventRepository;
import com.bookmyevent.event_service.repository.VenueRepository;
import com.bookmyevent.event_service.requestDto.CreateEventRequestDto;
import com.bookmyevent.event_service.requestDto.TicketTypeRequestDto;
import com.bookmyevent.event_service.responseDto.ArtistResponseDto;
import com.bookmyevent.event_service.responseDto.EventResponseDto;
import com.bookmyevent.event_service.responseDto.TicketTypeResponseDto;
import com.bookmyevent.event_service.service.EventService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private VenueRepository venueRepository;
    @Autowired
    private ArtistRepository artistRepository;

    @Override
    @Transactional
    public EventResponseDto createEvent(CreateEventRequestDto requestDto) {
        validateEventRequestDto(requestDto);

        Venue venue = venueRepository.findById(requestDto.getVenueId())
                .orElseThrow(() -> new RuntimeException("Venue not found!"));

        List<Artist> artists = resolveArtists(requestDto.getArtistIds());
        List<TicketType> ticketTypes = mapTicketTypes(requestDto.getTicketTypes());
        int totalSeatCapacity = 0;
        totalSeatCapacity = requestDto.getTicketTypes().stream()
                .mapToInt(TicketTypeRequestDto::getSeatCount)
                .sum();
        if(venue.getSeatCapacity() != totalSeatCapacity) {
            throw new RuntimeException("venue seat capacity is less than the total seat capacity!");
        }

        Event event = Event.builder()
                .name(requestDto.getName())
                .artists(artists)
                .ticketTypes(ticketTypes)
                .eventCategory(requestDto.getEventCategory())
                .venue(venue)
                .startDateTime(requestDto.getStartDateTime())
                .endDateTime(requestDto.getEndDateTime())
                .description(requestDto.getDescription())
                .build();

        Event savedEvent = eventRepository.save(event);

        return toResponseDto(savedEvent);
    }

    private void validateEventRequestDto(CreateEventRequestDto requestDto) {
        Optional<Event> eventOptional = eventRepository.findByName(requestDto.getName());
        if(eventOptional.isPresent()) {
            throw new RuntimeException("Event already exists!");
        }

        if(requestDto.getEndDateTime().isBefore(requestDto.getStartDateTime())) {
            throw new RuntimeException("End date must be after start date!");
        }
    }

    private List<Artist> resolveArtists(List<Long> artistIds) {
        if(artistIds == null || artistIds.isEmpty()) {
            return Collections.emptyList();
        }
        List<Artist> artists = artistRepository.findAllById(artistIds);
        if(artists.size() != artistIds.size()) {
            throw new RuntimeException("One or more artists not found!");
        }
        return artists;
    }

    private List<TicketType> mapTicketTypes(List<TicketTypeRequestDto> ticketTypeRequestDtos) {
        if(ticketTypeRequestDtos == null || ticketTypeRequestDtos.isEmpty()) {
            return Collections.emptyList();
        }
        return ticketTypeRequestDtos.stream()
                .map(dto -> TicketType.builder()
                        .type(dto.getType())
                        .price(dto.getPrice())
                        .seatCount(dto.getSeatCount())
                        .availableSeatCount(dto.getSeatCount())
                        .build())
                .toList();
    }

    private EventResponseDto toResponseDto(Event event) {
        List<ArtistResponseDto> artistResponses = event.getArtists() == null ? Collections.emptyList()
                : event.getArtists().stream()
                        .map(artist -> modelMapper.map(artist, ArtistResponseDto.class))
                        .toList();

        List<TicketTypeResponseDto> ticketTypeResponses = event.getTicketTypes() == null ? Collections.emptyList()
                : event.getTicketTypes().stream()
                        .map(ticketType -> modelMapper.map(ticketType, TicketTypeResponseDto.class))
                        .toList();

        String city = event.getVenue() != null && event.getVenue().getAddress() != null
                ? event.getVenue().getAddress().getCity()
                : null;

        return EventResponseDto.builder()
                .id(event.getId())
                .name(event.getName())
                .artists(artistResponses)
                .ticketTypes(ticketTypeResponses)
                .eventCategory(event.getEventCategory() != null ? event.getEventCategory().name() : null)
                .city(city)
                .startDateTime(event.getStartDateTime())
                .endDateTime(event.getEndDateTime())
                .status(event.getStatus() != null ? event.getStatus().name() : null)
                .organizerId(event.getOrganizerId())
                .description(event.getDescription())
                .createdAt(event.getCreatedAt())
                .build();
    }
}