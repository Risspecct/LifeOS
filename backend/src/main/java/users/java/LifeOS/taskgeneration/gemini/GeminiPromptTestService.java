package users.java.LifeOS.taskgeneration.gemini;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.taskgeneration.ai.TaskGenerationPromptBuilder;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GeminiPromptTestService {

    private final GeminiProperties properties;
    private final TaskGenerationPromptBuilder promptBuilder;

    public String testTaskGeneration() {

        Client client = Client.builder()
                .apiKey(properties.apiKey())
                .build();

        String prompt = promptBuilder.build(
                "Need to prepare for my Spring Boot interview next week",
                List.of(
                        "Backend",
                        "Interview Prep",
                        "Fitness"
                )
        );

        GenerateContentResponse response =
                client.models.generateContent(
                        properties.model(),
                        prompt,
                        null
                );

        return response.text();
    }
}