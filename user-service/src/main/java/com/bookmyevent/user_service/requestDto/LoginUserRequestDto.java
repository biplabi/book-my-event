package com.bookmyevent.user_service.requestDto;

import lombok.Data;

@Data
public class LoginUserRequestDto {
    private String email;
    private String password;
}
