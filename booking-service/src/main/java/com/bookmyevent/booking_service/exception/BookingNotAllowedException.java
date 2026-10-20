package com.bookmyevent.booking_service.exception;

public class BookingNotAllowedException extends RuntimeException {
    public BookingNotAllowedException(String message) {
        super(message);
    }
}
