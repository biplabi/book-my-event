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
    @Column(length = 1000)
    private String bio;
    /** Path of the photo in the MinIO bucket, e.g. artists/<uuid>.png. The public URL is built from it. */
    private String imageKey;
    private String country;
}
