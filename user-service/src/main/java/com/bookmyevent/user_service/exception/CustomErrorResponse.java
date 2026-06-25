package com.bookmyevent.user_service.exception;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomErrorResponse {
    private int statusCode;
    private boolean success;
    private String message;
    private String apiPath;
}
