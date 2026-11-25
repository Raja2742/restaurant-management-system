package restaurant_backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank(message = "Name is required")
        @Size(
                min = 2,
                max = 50,
                message = "Name must be between 2 and 50 characters"
        )
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        String email,

        @NotBlank(message = "Password is required")
        @Size(
                min = 6,
                max = 100,
                message = "Password must be between 6 and 100 characters"
        )
        String password,

        @NotBlank(message = "Phone number is required")
        @Pattern(
                regexp = "^[6-9][0-9]{9}$",
                message = "Enter a valid 10-digit Indian phone number"
        )
        String phone
) {
}