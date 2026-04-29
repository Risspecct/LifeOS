package users.java.LifeOS.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserDto (

    @NotBlank
    @Email
    String email,

    @NotBlank
    String username,

    @NotBlank
    String password
) {}