package users.java.LifeOS.note;

import jakarta.validation.constraints.NotNull;

public record NoteUpdateDto(
        @NotNull
        Long noteId,

        String title,

        String message,

        Long taskId
) { }
