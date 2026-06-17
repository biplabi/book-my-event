package com.bookmyevent.event_service.serviceImpl;

import com.bookmyevent.event_service.entity.Address;
import com.bookmyevent.event_service.entity.Venue;
import com.bookmyevent.event_service.repository.VenueRepository;
import com.bookmyevent.event_service.requestDto.CreateVenueRequestDto;
import com.bookmyevent.event_service.responseDto.VenueResponseDto;
import com.bookmyevent.event_service.service.VenueService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VenueServiceImpl implements VenueService {

    @Autowired
    private VenueRepository venueRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public VenueResponseDto createVenue(CreateVenueRequestDto requestDto) {
        Optional<Venue> venueOptional = venueRepository.findByName(requestDto.getName());
        if(venueOptional.isPresent()) {
            throw new RuntimeException("Venue already exists!");
        }

        Venue venue = Venue.builder()
                .name(requestDto.getName())
                .seatCapacity(requestDto.getSeatCapacity())
                .address(modelMapper.map(requestDto.getAddressDto(), Address.class))
                .build();
        Venue savedVenue = venueRepository.save(venue);

        return modelMapper.map(savedVenue, VenueResponseDto.class);
    }
}
