package users.java.LifeOS.note;

import jakarta.validation.constraints.NotBlank;

public record NoteCreateDto (
    @NotBlank
    String title,

    String message,

    Long taskId
) {}
