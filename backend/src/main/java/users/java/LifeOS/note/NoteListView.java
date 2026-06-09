package users.java.LifeOS.note;

import java.time.LocalDateTime;

public record NoteListView (
        Long id,
        String title,
        String message,
        Long taskId,
        String taskTitle,
        LocalDateTime updatedAt
)
{}
