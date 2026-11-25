package com.bookmyevent.event_service.listener;

/** An image key is no longer used by any record, so its file can be removed from MinIO. */
public record ImageRemovedEvent(String imageKey) {
}
