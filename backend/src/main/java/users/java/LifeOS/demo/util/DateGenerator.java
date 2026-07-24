package users.java.LifeOS.demo.util;

import org.springframework.stereotype.Component;
import users.java.LifeOS.demo.config.DemoConfiguration;
import users.java.LifeOS.friend.Friendship;
import users.java.LifeOS.notification.Notification;
import users.java.LifeOS.util.BaseEntity;

import java.time.LocalDateTime;

@Component
public class DateGenerator {

    private final RandomData random;
    private final DemoConfiguration config;

    public DateGenerator(
            RandomData random,
            DemoConfiguration config
    ) {
        this.random = random;
        this.config = config;
    }

    public LocalDateTime randomPastDays(int days) {
        return LocalDateTime.now()
                .minusDays(random.between(0, days))
                .minusHours(random.between(0, 23))
                .minusMinutes(random.between(0, 59));
    }

    public LocalDateTime randomFutureDays(int days) {
        return LocalDateTime.now()
                .plusDays(random.between(0, days))
                .plusHours(random.between(0, 23))
                .plusMinutes(random.between(0, 59));
    }

    public LocalDateTime randomTimelineDate() {
        int days = Math.max(1, config.getTimelineDays());
        int latestMinutesAgo = days > 3 ? 3 * 24 * 60 : 1;
        int minutes = random.between(latestMinutesAgo, days * 24 * 60);

        return LocalDateTime.now()
                .minusMinutes(minutes);
    }

    public LocalDateTime randomTimelineDateAfter(LocalDateTime start) {
        return randomTimelineDateAfter(start, 1);
    }

    public LocalDateTime randomTimelineDateAfter(
            LocalDateTime start,
            int minimumMinutes
    ) {
        return randomBetweenAfter(
                start,
                LocalDateTime.now(),
                minimumMinutes
        );
    }

    public LocalDateTime randomTimelineDateAfter(
            LocalDateTime start,
            LocalDateTime latest,
            int minimumMinutes
    ) {
        return randomBetweenAfter(start, latest, minimumMinutes);
    }

    private LocalDateTime randomBetweenAfter(
            LocalDateTime start,
            LocalDateTime latest,
            int minimumMinutes
    ) {

        LocalDateTime earliest = start.plusMinutes(minimumMinutes);

        if (!earliest.isBefore(latest)) {
            return earliest;
        }

        long minutes = java.time.Duration.between(earliest, latest).toMinutes();

        return earliest.plusMinutes(
                random.between(0, Math.max(0, (int) minutes))
        );
    }

    public LocalDateTime randomDueDateForCompletion(
            LocalDateTime createdAt,
            LocalDateTime completedAt
    ) {

        if (completedAt == null) {
            return null;
        }

        if (random.chance(0.85)) {
            return between(createdAt, completedAt);
        }

        return completedAt.plusDays(random.between(1, 3))
                .plusHours(random.between(0, 23))
                .plusMinutes(random.between(0, 59));
    }

    public LocalDateTime between(
            LocalDateTime start,
            LocalDateTime end
    ) {

        if (!start.isBefore(end)) {
            return start;
        }

        long minutes = java.time.Duration.between(start, end).toMinutes();

        return start.plusMinutes(
                random.between(0, Math.max(0, (int) minutes))
        );
    }

    public void applyTimestamps(BaseEntity entity) {
        applyTimestamps(entity, randomTimelineDate());
    }

    public void applyTimestamps(
            BaseEntity entity,
            LocalDateTime createdAt
    ) {

        entity.applyTimestamps(createdAt, createdAt);
    }

    public void applyTimestamps(
            BaseEntity entity,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {

        entity.applyTimestamps(createdAt, updatedAt);
    }

    public void applyTimestamp(Friendship friendship) {
        friendship.setCreatedAt(randomTimelineDate());
    }

    public void applyTimestamp(Notification notification) {
        notification.setCreatedAt(randomTimelineDate());
    }
}
