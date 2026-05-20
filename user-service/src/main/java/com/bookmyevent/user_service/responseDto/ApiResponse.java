package com.bookmyevent.user_service.responseDto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse<T>{
    private boolean success;
    private String message;
    private T data;
}
