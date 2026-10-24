package com.bookmyevent.event_service.enums;

/**
 * Folders event-service may write to in the public bookmyevent-media bucket.
 * Must match minio/policies/event-service.json.
 */
public enum MediaFolder {
    ARTISTS("artists"),
    EVENTS("events"),
    VENUES("venues");

    private final String path;

    MediaFolder(String path) {
        this.path = path;
    }

    public String getPath() {
        return path;
    }
}
