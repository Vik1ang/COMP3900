package com.yyds.recipe.exception.handle;

import com.yyds.recipe.exception.AuthorizationException;
import com.yyds.recipe.exception.MySqlErrorException;
import com.yyds.recipe.exception.response.ResponseCode;
import com.yyds.recipe.utils.ResponseUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class ExceptionHandle {
    @ExceptionHandler(AuthorizationException.class)
    @ResponseBody
    public ResponseEntity<?> authorizationException() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @ExceptionHandler(MySqlErrorException.class)
    @ResponseBody
    public ResponseEntity<?> mysqlErrorException() {
        return ResponseUtil.getResponse(ResponseCode.DATABASE_GENERAL_ERROR, null, null);
    }
}
