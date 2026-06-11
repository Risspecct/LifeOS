package users.java.LifeOS.taskgeneration;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.task.label.Label;
import users.java.LifeOS.task.label.LabelRepository;
import users.java.LifeOS.user.User;

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

        Label selectedLabel = resolveLabel(
                        draft.selectedLabel(),
                        userLabels
                );

        return new GeneratedTaskResponse(
                draft.title(),
                draft.description(),
                draft.taskType().name(),
                draft.priority(),
                selectedLabel != null
                        ? selectedLabel.getId()
                        : null,
                selectedLabel != null
                        ? selectedLabel.getName()
                        : null,
                draft.suggestedDueDate()
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
}