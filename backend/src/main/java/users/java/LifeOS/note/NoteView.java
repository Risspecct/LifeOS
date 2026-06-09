package users.java.LifeOS.note;

import java.time.LocalDateTime;

public record NoteView(
        Long id,
        String title,
        String message,
        Long taskId,
        LocalDateTime updatedAt
) {
}
