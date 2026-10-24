package com.bookmyevent.booking_service.controller.admin;

import com.bookmyevent.booking_service.responseDto.ApiResponse;
import com.bookmyevent.booking_service.responseDto.BookingResponseDto;
import com.bookmyevent.booking_service.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/bookings")
public class AdminBookingController {
    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponseDto>>> getAllBookings() {
        List<BookingResponseDto> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookings fetched successfully!", bookings));
    }
}
