package com.bookmyevent.user_service.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
