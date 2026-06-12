package users.java.LifeOS.taskgeneration.ai;

import java.util.List;

public class TaskGenerationPromptBuilder {
    public String build(String userPrompt, List<String> availableLabels) {

        return """
            You are a task generation assistant.

            Return ONLY valid JSON.

            Allowed Task Types:
            ACADEMICS
            CAREER
            FITNESS
            PROJECT
            PERSONAL
            HEALTH
            FINANCE
            GENERAL

            Allowed Priorities:
            LOW
            MEDIUM
            HIGH

            Choose exactly one label from:
            %s

            If no suitable label exists, return null.

            If no due date is mentioned, return null.

            Return this schema:

            {
              "title": "",
              "description": "",
              "taskType": "",
              "priority": "",
              "selectedLabel": "",
              "suggestedDueDate": ""
            }

            User Prompt:
            %s
            """
                .formatted(
                        String.join(", ", availableLabels),
                        userPrompt
                );
    }
}
