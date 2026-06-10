package com.bookmyevent.event_service.requestDto;
import com.bookmyevent.event_service.entity.Venue;
import com.bookmyevent.event_service.enums.EventCategory;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateEventRequestDto {
    @NotBlank(message = "Event name is required!")
    private String name;
    private List<Long> artistIds;
    @Valid
    private List<TicketTypeRequestDto> ticketTypes;
    @NotNull(message = "Event category is required!")
    private EventCategory eventCategory;
    @NotNull(message = "Venue is required!")
    private Venue venue;
    @NotNull(message = "Start date and time is required!")
    @Future(message = "Start date must be in future!")
    private LocalDateTime startDateTime;
    @NotNull(message = "End date and time is required!")
    private LocalDateTime endDateTime;
    @NotBlank(message = "Event description is required!")
    private String description;
}
