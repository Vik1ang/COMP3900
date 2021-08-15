package com.yyds.recipe.utils;

import com.yyds.recipe.exception.response.ResponseCode;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;

import java.util.Map;

public class ResponseUtil {
    public static ResponseEntity<?> getResponse(ResponseCode status, @Nullable HttpHeaders headers, @Nullable Map<String, Object> body) {
        return ResponseEntity
                .status(status.getCode())
                .headers(headers)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }
}
