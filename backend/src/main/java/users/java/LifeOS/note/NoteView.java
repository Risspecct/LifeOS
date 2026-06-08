package users.java.LifeOS.note;

public record NoteView(
        Long id,
        String title,
        String message,
        Long taskId
) {
}
