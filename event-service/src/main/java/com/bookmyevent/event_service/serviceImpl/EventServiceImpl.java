package com.bookmyevent.event_service.serviceImpl;

import com.bookmyevent.event_service.entity.Artist;
import com.bookmyevent.event_service.entity.Event;
import com.bookmyevent.event_service.entity.TicketType;
import com.bookmyevent.event_service.entity.Venue;
import com.bookmyevent.event_service.enums.EventStatus;
import com.bookmyevent.event_service.exception.InsufficientSeatCapacityException;
import com.bookmyevent.event_service.exception.InvalidStatusTransitionException;
import com.bookmyevent.event_service.exception.ResourceNotFoundException;
import com.bookmyevent.event_service.exception.DuplicateResourceException;
import com.bookmyevent.event_service.repository.ArtistRepository;
import com.bookmyevent.event_service.repository.EventRepository;
import com.bookmyevent.event_service.repository.VenueRepository;
import com.bookmyevent.event_service.requestDto.CreateEventRequestDto;
import com.bookmyevent.event_service.requestDto.TicketTypeRequestDto;
import com.bookmyevent.event_service.responseDto.ArtistResponseDto;
import com.bookmyevent.event_service.responseDto.EventResponseDto;
import com.bookmyevent.event_service.responseDto.TicketTypeResponseDto;
import com.bookmyevent.event_service.service.ArtistService;
import com.bookmyevent.event_service.service.EventService;
import com.bookmyevent.event_service.service.VenueService;
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
    @Autowired
    private ArtistService artistService;
    @Autowired
    private VenueService venueService;

    @Override
    @Transactional
    public EventResponseDto createEvent(CreateEventRequestDto requestDto) {
        validateEventRequestDto(requestDto);

        Venue venue = venueRepository.findById(requestDto.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found!"));

        List<Artist> artists = resolveArtists(requestDto.getArtistIds());
        List<TicketType> ticketTypes = mapTicketTypes(requestDto.getTicketTypes());
        int totalSeatsRequired = 0;
        totalSeatsRequired = requestDto.getTicketTypes().stream()
                .mapToInt(TicketTypeRequestDto::getSeatCount)
                .sum();
        if(totalSeatsRequired > venue.getSeatCapacity()) {
            throw new InsufficientSeatCapacityException("venue seat capacity is less than the required seats!");
        }

        Event event = Event.builder()
                .name(requestDto.getName())
                .artists(artists)
                .ticketTypes(ticketTypes)
                .eventCategory(requestDto.getEventCategory())
                .venue(venue)
                .startDateTime(requestDto.getStartDateTime())
                .endDateTime(requestDto.getEndDateTime())
                .organizerId(requestDto.getOrganizerId())
                .description(requestDto.getDescription())
                .build();

        Event savedEvent = eventRepository.save(event);

        return toResponseDto(savedEvent);
    }

    @Override
    public List<EventResponseDto> getAllEvents(boolean includeUnpublished) {
        List<Event> eventList = includeUnpublished
                ? eventRepository.findAll()
                : eventRepository.findByStatus(EventStatus.PUBLISHED);
        List<EventResponseDto> eventResponseDtos = eventList.stream()
                .map(this::toResponseDto)
                .toList();
        return eventResponseDtos;
    }

    @Override
    public EventResponseDto getEventById(Long id) {

        Optional<Event> eventOptional = eventRepository.findById(id);
        Event event = eventOptional.orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        return toResponseDto(event);
    }

    @Override
    @Transactional
    public EventResponseDto updateEventStatus(Long id, EventStatus status) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        if(event.getStatus() == status) {
            return toResponseDto(event);
        }
        if(event.getStatus() == EventStatus.CANCELLED || event.getStatus() == EventStatus.COMPLETED) {
            throw new InvalidStatusTransitionException("A " + event.getStatus().name().toLowerCase() + " event can't be changed!");
        }
        // COMPLETED is reached once the event has happened, not set by hand.
        if(status == EventStatus.COMPLETED) {
            throw new InvalidStatusTransitionException("Events can't be marked completed manually!");
        }

        event.setStatus(status);
        return toResponseDto(eventRepository.save(event));
    }

    private void validateEventRequestDto(CreateEventRequestDto requestDto) {
        Optional<Event> eventOptional = eventRepository.findByName(requestDto.getName());
        if(eventOptional.isPresent()) {
            throw new DuplicateResourceException("Event already exists!");
        }

        if(requestDto.getEndDateTime().isBefore(requestDto.getStartDateTime())) {
            throw new DuplicateResourceException("End date must be after start date!");
        }
    }

    private List<Artist> resolveArtists(List<Long> artistIds) {
        if(artistIds == null || artistIds.isEmpty()) {
            return Collections.emptyList();
        }
        List<Artist> artists = artistRepository.findAllById(artistIds);
        if(artists.size() != artistIds.size()) {
            throw new ResourceNotFoundException("One or more artists not found!");
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
                        .map(artistService::toResponseDto)
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
                .venue(event.getVenue() != null ? venueService.toResponseDto(event.getVenue()) : null)
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