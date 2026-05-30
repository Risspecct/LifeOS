package users.java.LifeOS.activity;

import java.time.LocalDateTime;

public record ActivityStats(
        LocalDateTime lastActiveDate,
        Long totalActiveDays
) {
}
