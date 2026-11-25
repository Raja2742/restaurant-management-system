package restaurant_backend.dto.staff;

import restaurant_backend.entity.Role;

import java.time.LocalDateTime;

public record StaffResponse(

        Long id,

        String name,

        String email,

        String phone,

        Role role,

        LocalDateTime createdAt,

        LocalDateTime updatedAt

) {
}