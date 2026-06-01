package users.java.LifeOS.task;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import users.java.LifeOS.user.UserService;

@AllArgsConstructor
@RestController
@RequestMapping("/task")
public class TaskController {
    private final TaskService taskService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody TaskDto dto) {
        return new ResponseEntity<>(taskService.create(userService.getAuthenticatedUser(), dto), HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(taskService.getAll(userService.getUserId()));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<?> getTask(@PathVariable long taskId) {
        return ResponseEntity.ok(taskService.getTask(userService.getUserId(), taskId));
    }

    @PutMapping("/{taskId}/{status}")
    public ResponseEntity<?> updateStatus(@PathVariable long taskId, @PathVariable Status status) {
        return ResponseEntity.ok(taskService.updateStatus(userService.getAuthenticatedUser(), taskId, status));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable long taskId, @Valid @RequestBody TaskUpdateDto dto) {
        return ResponseEntity.ok(taskService.updateTask(userService.getUserId(), taskId, dto));
    }

    @GetMapping
    public ResponseEntity<?> getTasks(
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Long labelId,
            @RequestParam(required = false) String taskType
    ) {
        return ResponseEntity.ok(taskService.getTasks(userService.getUserId(), status, labelId, taskType));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingTasks() {
        return ResponseEntity.ok(taskService.getUpcomingTasks(userService.getAuthenticatedUser()));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getTaskStats() {
        return ResponseEntity.ok(taskService
                .getTaskStats(
                        userService.getAuthenticatedUser()
                )
        );
    }

    @DeleteMapping
    public ResponseEntity<?> deleteTask( @RequestParam long taskId) {
        taskService.delete(userService.getUserId(), taskId);
        return ResponseEntity.ok("Task deleted successfully!");
    }
}
