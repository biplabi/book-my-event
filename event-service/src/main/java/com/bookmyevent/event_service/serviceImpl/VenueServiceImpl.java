package com.bookmyevent.event_service.serviceImpl;

import com.bookmyevent.event_service.entity.Address;
import com.bookmyevent.event_service.entity.Venue;
import com.bookmyevent.event_service.exception.DuplicateResourceException;
import com.bookmyevent.event_service.repository.VenueRepository;
import com.bookmyevent.event_service.requestDto.CreateVenueRequestDto;
import com.bookmyevent.event_service.responseDto.AddressResponseDto;
import com.bookmyevent.event_service.responseDto.VenueResponseDto;
import com.bookmyevent.event_service.service.VenueService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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
            throw new DuplicateResourceException("Venue already exists!");
        }

        Venue venue = Venue.builder()
                .name(requestDto.getName())
                .seatCapacity(requestDto.getSeatCapacity())
                .address(modelMapper.map(requestDto.getAddressDto(), Address.class))
                .build();
        Venue savedVenue = venueRepository.save(venue);

        return modelMapper.map(savedVenue, VenueResponseDto.class);
    }

    @Override
    public List<VenueResponseDto> getAllVenue() {
        List<Venue> venueList = venueRepository.findAll();
        return toVenueResponse(venueList);
    }

    private List<VenueResponseDto> toVenueResponse(List<Venue> venueList) {
        return venueList.stream()
                .map(venue -> {
                    return VenueResponseDto.builder()
                            .id(venue.getId())
                            .name(venue.getName())
                            .seatCapacity(venue.getSeatCapacity())
                            .address(toAddressResponseDto(venue.getAddress()))
                            .createdAt(venue.getCreatedAt())
                            .build();
                }).toList();
    }

    private AddressResponseDto toAddressResponseDto(Address address) {
        return AddressResponseDto.builder()
                .street(address.getStreet())
                .city(address.getCity())
                .pinCode(address.getPinCode())
                .country(address.getCountry())
                .build();
    }
}
