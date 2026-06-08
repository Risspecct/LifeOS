package users.java.LifeOS.note;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserService;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;
    private final UserService userService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoteView createNote(@RequestBody NoteCreateDto dto) {
        return noteService.createNote(dto);
    }

    @GetMapping("/{noteId}")
    public NoteView getNote(@PathVariable Long noteId) {
        return noteService.getNote(userService.getUserId(), noteId);
    }

    @GetMapping
    public List<NoteListView> getAllNotes() {
        User currentUser = userService.getAuthenticatedUser();

        return noteService.getAllNotes(currentUser);
    }

    @GetMapping("/task/{taskId}")
    public List<NoteListView> getNotesByTask(@PathVariable Long taskId) {
        User currentUser = userService.getAuthenticatedUser();

        return noteService.getAllNotesByTask(currentUser.getId(), taskId);
    }

    @PutMapping
    public NoteView updateNote(@RequestBody NoteUpdateDto dto) {
        User currentUser = userService.getAuthenticatedUser();

        return noteService.updateNote(currentUser, dto);
    }

    @DeleteMapping("/{noteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteNote(@PathVariable Long noteId) {
        User currentUser = userService.getAuthenticatedUser();

        noteService.deleteNote(currentUser.getId(), noteId);
    }
}