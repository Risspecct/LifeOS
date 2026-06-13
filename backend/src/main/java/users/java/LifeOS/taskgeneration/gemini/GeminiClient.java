package users.java.LifeOS.taskgeneration.gemini;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import users.java.LifeOS.taskgeneration.ai.AiClient;
import users.java.LifeOS.taskgeneration.ai.GeneratedTaskDraft;
import users.java.LifeOS.taskgeneration.ai.TaskGenerationPromptBuilder;

import java.util.List;

@Primary
@Service
@RequiredArgsConstructor
public class GeminiClient implements AiClient {

    private final GeminiProperties properties;
    private final TaskGenerationPromptBuilder promptBuilder;
    private final ObjectMapper objectMapper;
    private final Client googleGeminiClient;

    @Override
    public GeneratedTaskDraft generateTaskDraft(String prompt, List<String> availableLabels) {

        String finalPrompt = promptBuilder.build(prompt, availableLabels);

        try {
            GenerateContentResponse response = googleGeminiClient.models.generateContent(
                    properties.model(),
                    finalPrompt,
                    null
            );
            return parseResponse(response.text());

        } catch (Exception e) {
            return new GeneratedTaskDraft(
                    prompt,
                    "",
                    "GENERAL",
                    "MEDIUM",
                    null,
                    null
            );
        }
    }

    private GeneratedTaskDraft parseResponse(String response) {
        try {
            return objectMapper.readValue(response, GeneratedTaskDraft.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }
}