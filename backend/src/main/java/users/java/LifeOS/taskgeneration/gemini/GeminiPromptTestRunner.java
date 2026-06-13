package users.java.LifeOS.taskgeneration.gemini;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GeminiPromptTestRunner implements CommandLineRunner {

    private final GeminiPromptTestService service;

    @Override
    public void run(String... args) {

        String response = service.testTaskGeneration();

        System.out.println("========== GEMINI RESPONSE ==========");
        System.out.println(response);
        System.out.println("=====================================");
    }
}