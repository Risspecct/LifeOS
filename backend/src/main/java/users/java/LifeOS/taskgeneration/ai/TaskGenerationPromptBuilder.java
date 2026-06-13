package users.java.LifeOS.taskgeneration.ai;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class TaskGenerationPromptBuilder {

    public String build(String userPrompt, List<String> labels) {

        return """
                You are a task generation assistant.

                Analyze the user's task request and return ONLY valid JSON.

                IMPORTANT RULES:

                - Return ONLY JSON.
                - Do NOT wrap the JSON in markdown.
                - Do NOT use ```json.
                - Do NOT provide explanations.
                - Do NOT include text before or after the JSON.
                - Do NOT invent labels.
                - Select exactly one label from the provided list or return null.

                Today's date is: %s
                
                When the user mentions a weekday:
                - Always choose the next occurrence of that weekday in the future.
                - Never return a date in the past.
                
                Examples:
                Friday -> 2026-06-19
                Monday -> 2026-06-15
                
                When the user says "in X days":
                - Add X calendar days to today's date.
                
                Example:
                in 2 days -> 2026-06-15
                
                Return the calculated date in ISO-8601 format.
                
                Allowed Task Types:
                - ACADEMICS
                - CAREER
                - FITNESS
                - PROJECT
                - PERSONAL
                - HEALTH
                - FINANCE
                - GENERAL

                Allowed Priorities:
                - LOW
                - MEDIUM
                - HIGH

                Priority Guidelines:

                HIGH:
                - Deadlines within a few days
                - Urgent work
                - Exams, interviews, submissions

                MEDIUM:
                - Important tasks without immediate deadlines
                - Weekly goals

                LOW:
                - Long-term goals
                - Optional activities
                - "Someday" tasks

                Available Labels:

                %s

                Due Date Rules:

                suggestedDueDate MUST be either:
                - null
                OR
                - a valid ISO-8601 datetime

                Valid examples:

                2026-06-20T23:59:59
                2026-07-01T18:00:00

                Invalid examples:

                tomorrow
                next week
                Friday
                End of next week
                next month

                Infer dates when possible using today's date.

                Response Schema:

                {
                  "title": "string",
                  "description": "string",
                  "taskType": "ACADEMICS|CAREER|FITNESS|PROJECT|PERSONAL|HEALTH|FINANCE|GENERAL",
                  "priority": "LOW|MEDIUM|HIGH",
                  "selectedLabel": "label from available labels or null",
                  "suggestedDueDate": "ISO-8601 datetime or null"
                }

                User Request:

                %s
                """
                .formatted(
                        LocalDate.now(),
                        String.join(", ", labels),
                        userPrompt
                );
    }
}