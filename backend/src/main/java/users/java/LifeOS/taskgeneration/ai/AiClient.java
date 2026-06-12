package users.java.LifeOS.taskgeneration.ai;

import java.util.List;

public interface AiClient {
    GeneratedTaskDraft generateTaskDraft(String prompt, List<String> availableLabels);
}