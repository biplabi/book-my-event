package com.bookmyevent.event_service.repository;

import com.bookmyevent.event_service.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    Optional<Artist> findByStageName(String stageName);
}
