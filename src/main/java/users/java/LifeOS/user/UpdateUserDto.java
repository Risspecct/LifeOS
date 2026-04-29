package users.java.LifeOS.user;

import jakarta.validation.constraints.Email;

public record UpdateUserDto (
        @Email
        String email,

        String username,

        String password
) {}