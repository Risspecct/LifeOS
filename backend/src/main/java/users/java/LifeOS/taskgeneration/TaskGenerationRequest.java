package users.java.LifeOS.taskgeneration;

import jakarta.validation.constraints.NotBlank;

public record TaskGenerationRequest(
        @NotBlank
        String prompt
) {
}