package users.java.LifeOS.task.prioritization;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class PrioritizationController {

    private final PrioritizationService prioritizationService;

    @GetMapping("/prioritized")
    public ResponseEntity<?> getPrioritizedTasks() {
        return ResponseEntity.ok(prioritizationService.getPrioritizedTasks());
    }
}