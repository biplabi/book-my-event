package com.bookmyevent.event_service.exception;

public class InsufficientSeatCapacityException extends RuntimeException{
    public InsufficientSeatCapacityException(String message) {
        super(message);
    }
}
