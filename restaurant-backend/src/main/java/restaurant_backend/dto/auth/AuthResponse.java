package restaurant_backend.dto.auth;

public record AuthResponse(
        String token,
        Long userId,
        String name,
        String email,
        String role
) {
}