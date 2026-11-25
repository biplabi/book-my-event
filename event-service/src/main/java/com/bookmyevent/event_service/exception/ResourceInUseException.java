package com.bookmyevent.event_service.exception;

/** The resource is still referenced elsewhere, so it can't be removed (409). */
public class ResourceInUseException extends RuntimeException {
    public ResourceInUseException(String message) {
        super(message);
    }
}
