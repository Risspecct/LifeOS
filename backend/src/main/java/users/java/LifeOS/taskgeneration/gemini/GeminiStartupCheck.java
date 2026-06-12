package users.java.LifeOS.taskgeneration.gemini;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GeminiStartupCheck implements CommandLineRunner {

    private final GeminiProperties properties;

    @Override
    public void run(String... args) {

        System.out.println(
                "Gemini Model: " + properties.model()
        );

        System.out.println(
                "API Key Loaded: " +
                        (properties.apiKey() != null)
        );
    }
}