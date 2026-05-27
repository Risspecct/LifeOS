package users.java.LifeOS.insights;

import java.time.LocalDateTime;

public record ActivityTimelineDto(
        String activityType,
        String description,
        Integer points,
        LocalDateTime createdAt
) {
}