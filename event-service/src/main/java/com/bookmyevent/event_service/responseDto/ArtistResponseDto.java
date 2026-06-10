package com.bookmyevent.event_service.responseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtistResponseDto {
    private Long id;
    private String stageName;
    private String genre;
    private String bio;
    private String imageUrl;
    private String country;
}
