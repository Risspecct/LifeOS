package users.java.LifeOS.taskgeneration;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.task.TaskPriority;
import users.java.LifeOS.task.label.Label;
import users.java.LifeOS.task.label.LabelRepository;
import users.java.LifeOS.taskgeneration.ai.AiTaskGenerationService;
import users.java.LifeOS.taskgeneration.ai.GeneratedTaskDraft;
import users.java.LifeOS.user.User;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskGenerationService {

    private final AiTaskGenerationService aiTaskGenerationService;
    private final LabelRepository labelRepository;

    public GeneratedTaskResponse generateTaskDraft(User user, String prompt) {

        List<Label> userLabels = labelRepository.findAllByUser(user);

        List<String> availableLabels = userLabels.stream()
                        .map(Label::getName)
                        .toList();

        GeneratedTaskDraft draft = aiTaskGenerationService.generateDraft(prompt, availableLabels);

        Label selectedLabel = resolveLabel(draft.selectedLabel(), userLabels);
        TaskType taskType = parseTaskType(draft.taskType());
        TaskPriority priority = parsePriority(draft.priority());
        LocalDateTime dueDate = parseDueDate(draft.suggestedDueDate());

        return new GeneratedTaskResponse(
                draft.title(),
                draft.description(),
                taskType,
                priority,
                selectedLabel != null ? selectedLabel.getId() : null,
                selectedLabel != null ? selectedLabel.getName() : null,
                dueDate
        );
    }

    private Label resolveLabel(String selectedLabel, List<Label> userLabels) {
        if (selectedLabel == null) {
            return null;
        }

        return userLabels.stream().filter(label ->
                        label.getName().equalsIgnoreCase(selectedLabel))
                .findFirst()
                .orElse(null);
    }

    private TaskType parseTaskType(String value) {

        if (value == null) {
            return TaskType.GENERAL;
        }

        try {
            return TaskType.valueOf(
                    value.trim().toUpperCase()
            );
        } catch (Exception e) {
            return TaskType.GENERAL;
        }
    }

    private TaskPriority parsePriority(String value) {

        if (value == null) {
            return TaskPriority.MEDIUM;
        }

        try {
            return TaskPriority.valueOf(
                    value.trim().toUpperCase()
            );
        } catch (Exception e) {
            return TaskPriority.MEDIUM;
        }
    }

    private LocalDateTime parseDueDate(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        try {
            LocalDateTime dueDate = LocalDateTime.parse(value);

            if (dueDate.isBefore(LocalDateTime.now())) {
                dueDate = null;
            }

            return dueDate;

        } catch (Exception e) {
            return null;
        }
    }
}