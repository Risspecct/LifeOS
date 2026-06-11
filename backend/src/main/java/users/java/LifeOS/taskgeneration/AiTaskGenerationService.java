package users.java.LifeOS.taskgeneration;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiTaskGenerationService {
    private final AiClient aiClient;

    public GeneratedTaskDraft generateDraft(String prompt, List<String> availableLabels) {
        return aiClient.generateTaskDraft(prompt, availableLabels);
    }
}