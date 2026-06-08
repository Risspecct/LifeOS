package users.java.LifeOS.note;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.exceptions.InvalidRequestException;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.TaskService;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserService;

@RequiredArgsConstructor
@Service
public class NoteService {
    private final NoteRepository noteRepository;
    private final UserService userService;
    private final TaskService taskService;
    private final NoteMapper noteMapper;

    public NoteView createNote(NoteCreateDto dto) {
        User currentUser = userService.getAuthenticatedUser();

        if (noteRepository.existsByUserAndTitle(currentUser, dto.title()))
            throw new InvalidRequestException("Note with title exists already");

        Task task = taskService.

        Note note = noteMapper.toEntity(dto);
        note.setUser(currentUser);

        noteRepository.save(note);
        return noteMapper
    }
}
