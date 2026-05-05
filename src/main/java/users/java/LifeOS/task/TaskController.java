package users.java.LifeOS.task;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import users.java.LifeOS.user.UserService;

@RestController
@RequestMapping("/task")
public class TaskController {
    private final TaskService taskService;
    private final UserService userService;

    TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody TaskDto dto) {
        return new ResponseEntity<>(taskService.create(userService.getUserId(), dto), HttpStatus.CREATED);
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
        return ResponseEntity.ok(taskService.updateStatus(userService.getUserId(), taskId, status));
    }
}
