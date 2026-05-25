package com.bookmyevent.event_service.entity;

import com.bookmyevent.event_service.enums.EventStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "event")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    @ElementCollection
    @CollectionTable(
            name = "event_ticket_types",
            joinColumns = @JoinColumn(name = "event_id")
    )
    private List<TicketType> ticketType;
    private String city;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private EventStatus status;
    private Long organizerId;
    private String description;
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if(null == status) {
            status = EventStatus.DRAFT;
        }
        createdAt = LocalDateTime.now();
    }
}
