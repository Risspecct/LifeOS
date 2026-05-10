package users.java.LifeOS.activity;

import java.time.LocalDateTime;

public record ActivityResponse(

        Long id,
        String title,
        String description,
        ActivityType activityType,
        Integer points,

        Long taskId,
        String taskTitle,

        LocalDateTime createdAt
) {
}