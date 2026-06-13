package users.java.LifeOS.taskgeneration.gemini;

import com.google.genai.Client;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(GeminiProperties.class)
public class GeminiConfig {

    @Bean
    public Client googleGeminiClient(
            GeminiProperties properties
    ) {
        return Client.builder()
                .apiKey(properties.apiKey())
                .build();
    }
}