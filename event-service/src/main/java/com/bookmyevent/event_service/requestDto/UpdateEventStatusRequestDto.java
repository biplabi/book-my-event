package com.bookmyevent.event_service.requestDto;

import com.bookmyevent.event_service.enums.EventStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateEventStatusRequestDto {
    @NotNull(message = "Status is required!")
    private EventStatus status;
}
