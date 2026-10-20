package com.bookmyevent.event_service.repository;

import com.bookmyevent.event_service.entity.Event;
import com.bookmyevent.event_service.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByName(String name);

    List<Event> findByStatus(EventStatus status);
}
