package restaurant_backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import restaurant_backend.dto.error.ErrorResponse;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException exception,
            HttpServletRequest request
    ) {

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        "Not Found",
                        exception.getMessage(),
                        request.getRequestURI(),
                        null
                );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(
            BadRequestException exception,
            HttpServletRequest request
    ) {

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.BAD_REQUEST.value(),
                        "Bad Request",
                        exception.getMessage(),
                        request.getRequestURI(),
                        null
                );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorResponse> handleConflict(
            ConflictException exception,
            HttpServletRequest request
    ) {

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.CONFLICT.value(),
                        "Conflict",
                        exception.getMessage(),
                        request.getRequestURI(),
                        null
                );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {

        Map<String, String> errors =
                new HashMap<>();

        for (FieldError error :
                exception.getBindingResult()
                        .getFieldErrors()) {

            errors.put(
                    error.getField(),
                    error.getDefaultMessage()
            );
        }

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.BAD_REQUEST.value(),
                        "Validation Failed",
                        "Please correct the invalid fields",
                        request.getRequestURI(),
                        errors
                );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(
            Exception exception,
            HttpServletRequest request
    ) {

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        "Internal Server Error",
                        "An unexpected error occurred",
                        request.getRequestURI(),
                        null
                );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }


    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(
            InvalidCredentialsException exception,
            HttpServletRequest request
    ) {

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.UNAUTHORIZED.value(),
                        "Unauthorized",
                        exception.getMessage(),
                        request.getRequestURI(),
                        null
                );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }
}