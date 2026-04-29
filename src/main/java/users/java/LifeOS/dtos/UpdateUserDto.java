package users.java.LifeOS.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateUserDto (
        @Email
        String email,

        String username,

        String password
) {}