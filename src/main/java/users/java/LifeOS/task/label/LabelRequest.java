package users.java.LifeOS.task.label;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record LabelRequest(

        @NotBlank(message = "Label name is required")
        String name,

        String color,

        @Min(value = 0, message = "Priority weight cannot be negative")
        @Max(value = 100, message = "Priority weight cannot exceed 100")
        Integer priorityWeight
) {
}