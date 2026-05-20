package com.bookmyevent.user_service.responseDto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileResponseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private Long phoneNumber;
    private String email;
    private String password;
    private LocalDate dateOfBirth;
    private String role;
    private boolean isActive;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}
