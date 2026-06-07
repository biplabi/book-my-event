package com.bookmyevent.event_service.repository;

import com.bookmyevent.event_service.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}
