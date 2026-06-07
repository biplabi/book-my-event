package com.bookmyevent.event_service.repository;

import com.bookmyevent.event_service.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
}
