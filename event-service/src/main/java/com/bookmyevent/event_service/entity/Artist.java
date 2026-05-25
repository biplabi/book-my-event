package com.bookmyevent.event_service.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table
public class Artist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private int age;
    private String city;
    private String country;
    @ManyToMany(mappedBy = "artists")
    private List<Event> events;
}
