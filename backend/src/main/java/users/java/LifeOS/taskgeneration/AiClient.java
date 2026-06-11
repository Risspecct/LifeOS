package users.java.LifeOS.taskgeneration;

import java.util.List;

public interface AiClient {
    GeneratedTaskDraft generateTaskDraft(String prompt, List<String> availableLabels);
}