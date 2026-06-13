package users.java.LifeOS.taskgeneration;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import users.java.LifeOS.user.UserService;

@RestController
@RequestMapping("/api/task-generation")
@RequiredArgsConstructor
public class TaskGenerationController {
    private final UserService userService;
    private final TaskGenerationService taskGenerationService;

    @PostMapping
    public GeneratedTaskResponse generateTaskDraft(@Valid @RequestBody TaskGenerationRequest request) {
        return taskGenerationService.generateTaskDraft(userService.getAuthenticatedUser(), request.prompt());
    }
}