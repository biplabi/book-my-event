package com.bookmyevent.user_service.requestDto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
@Data
public class RegisterUserRequestDto {
    @NotBlank(message = "First name can not be blank")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name can not be blank")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters.")
    private String lastName;

    @NotNull(message = "Phone number is required")
    @Digits(integer = 10, fraction = 0, message = "Phone number must be a valid 10-digit number")
    private Long phoneNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be 8 characters long")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\\\d)(?=.*[@$!%*?&]).+$",
    message = "Password must contain uppercase, lowercase, digit, and special character")
    private String password;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Role is required")
    private String role;
}
