package users.java.LifeOS.task.prioritization;

import org.springframework.stereotype.Component;
import users.java.LifeOS.task.Task;

@Component
public class PrioritizationMapper {

    public PrioritizedTaskResponse toResponse(
            Task task,
            PriorityResult result
    ) {

        return new PrioritizedTaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getDueDate(),
                result.score(),
                result.level(),
                result.reasons()
        );
    }
}