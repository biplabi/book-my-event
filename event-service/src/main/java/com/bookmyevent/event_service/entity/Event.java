package com.bookmyevent.event_service.entity;

import com.bookmyevent.event_service.enums.TicketStatus;
import com.bookmyevent.event_service.enums.TicketType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "event")
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @ManyToMany
    @JoinTable(
            name = "event_artists",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "artist_id")
    )
    private List<Artist> artists;
    @Enumerated(EnumType.STRING)
    private TicketType ticketType;
    private Integer ticketCount;
    private String city;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Double price;
    private TicketStatus status;
    private Long organizerId;
    private String description;
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if(null == status) {
            status = TicketStatus.DRAFT;
        }
        createdAt = LocalDateTime.now();
    }
}
