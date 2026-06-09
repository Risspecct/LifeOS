package users.java.LifeOS.note;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;
import users.java.LifeOS.exceptions.InvalidRequestException;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.TaskService;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserService;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class NoteService {
    private final NoteRepository noteRepository;
    private final UserService userService;
    private final TaskService taskService;
    private final NoteMapper noteMapper;

    public NoteView createNote(NoteCreateDto dto) {
        User currentUser = userService.getAuthenticatedUser();
        Task task = null;

        if (noteRepository.existsByUserAndTitle(currentUser, dto.title()))
            throw new InvalidRequestException("Note with title exists already");

        if (dto.taskId() != null)
            task = taskService.getVerifiedTask(currentUser.getId(), dto.taskId());

        Note note = noteMapper.toEntity(dto);

        note.setUser(currentUser);
        note.setTask(task);

        noteRepository.save(note);
        return noteMapper.toNoteView(note);
    }

    public NoteView getNote(long userId, long noteId) {
        Note note = getVerifiedNote(userId, noteId);

        return noteMapper.toNoteView(note);
    }

    public List<NoteListView> getAllNotes(User user) {
        List<Note> notes = noteRepository.findAllByUser(user);

        return noteMapper.toNoteListViewList(notes);
    }

    public List<NoteListView> getAllNotesByTask(long userId, long taskId) {
        Task task = taskService.getVerifiedTask(userId, taskId);

        List<Note> notes = noteRepository.findAllByTask(task);

        return noteMapper.toNoteListViewList(notes);
    }

    public NoteView updateNote(User user, NoteUpdateDto dto) {
        Note note = getVerifiedNote(user.getId(), dto.noteId());

        if (dto.title() != null && !dto.title().trim().equals(note.getTitle()) &&
                Boolean.TRUE.equals(noteRepository.existsByUserAndTitleAndIdNot(user, dto.title(), note.getId())))
            throw new InvalidRequestException("Note with title already exists");

        Note updatedNote = noteMapper.updateNote(dto, note);
        if (dto.taskId() == null) {
            updatedNote.setTask(null);
        } else if (note.getTask() == null || dto.taskId().compareTo(note.getTask().getId()) != 0) {
            Task task = taskService.getVerifiedTask(user.getId(), dto.taskId());
            updatedNote.setTask(task);
        }

        noteRepository.save(updatedNote);

        return noteMapper.toNoteView(updatedNote);
    }

    public void deleteNote(long userId, long noteId) {
        Note note = getVerifiedNote(userId, noteId);

        noteRepository.delete(note);
    }

    private Note getVerifiedNote(long userId, Long noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new NotFoundException("No such note exists"));

        if (userId != note.getUser().getId()) {
            log.error("Unauthorized access to note with id: {}", note.getId());
            throw new AuthorizationDeniedException("You are not allowed access to this resource");
        }

        return note;
    }
}
