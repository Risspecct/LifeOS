package users.java.LifeOS.feed;

import users.java.LifeOS.activity.ActivityType;
import java.time.LocalDateTime;

public record FriendActivityResponse(
        Long id,
        Long userId,
        String username,
        String title,
        String description,
        ActivityType activityType,
        LocalDateTime createdAt
) {
}