package com.bookmyevent.booking_service.responseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventResponseDto {
    private Long id;
    private String name;
    private List<ArtistResponseDto> artists;
    private List<TicketTypeResponseDto> ticketTypes;
    private String eventCategory;
    private String city;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String status;
    private Long organizerId;
    private String description;
    private LocalDateTime createdAt;
}
