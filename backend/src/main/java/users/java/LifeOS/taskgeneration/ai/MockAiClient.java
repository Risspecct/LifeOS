package users.java.LifeOS.taskgeneration.ai;

import org.springframework.stereotype.Service;
import users.java.LifeOS.task.TaskPriority;
import users.java.LifeOS.taskgeneration.TaskType;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MockAiClient implements AiClient {

    @Override
    public GeneratedTaskDraft generateTaskDraft(String prompt, List<String> availableLabels) {

        return new GeneratedTaskDraft(
                "Prepare for Spring Boot Interview",
                "Review Spring Boot, Security and JPA concepts.",
                TaskType.CAREER.toString(),
                TaskPriority.HIGH.toString(),
                availableLabels.isEmpty() ? null : availableLabels.getFirst(),
                LocalDateTime.now().plusDays(7).toString()
        );
    }
}