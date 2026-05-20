package com.bookmyevent.user_service.responseDto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginUserResponseDto {
    private Long id;
    private String firstName;
    private String email;
    private String token;
}
