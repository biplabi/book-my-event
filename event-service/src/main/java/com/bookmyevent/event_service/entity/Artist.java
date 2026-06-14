package com.bookmyevent.event_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "artists")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Artist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String stageName;
    private String genre;
    private String bio;
    private String imageUrl;
    private String country;
}
