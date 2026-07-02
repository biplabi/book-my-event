package com.bookmyevent.booking_service.requestDto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingRequestDto {
    @NotNull(message = "Event id is required!")
    private Long eventId;
    @NotBlank(message = "At least one ticket type details required!")
    @Valid
    private List<TicketRequestDto> tickets;
}
