package users.java.LifeOS.stats;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.level.LevelProgressionService;
import users.java.LifeOS.task.Status;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.user.User;

@AllArgsConstructor
@Service
public class StatsUpdateService {
    private final StatsService statsService;
    private final StreakService streakService;
    private final LevelProgressionService levelProgressionService;

    @Transactional
    public void taskCompleted(User user, long points) {
        UserStats stats = statsService.getStats(user);


        long oldPoints = stats.getTotalPoints();
        stats.updateTotalPoints(points);
        long newPoints = stats.getTotalPoints();

        stats.updateTasksCompletedCount(1);

        streakService.updateStreak(stats);

        levelProgressionService.handleLevelProgression(user, oldPoints, newPoints);
    }

    @Transactional
    public void taskDeleted(Task task) {
        UserStats stats = statsService.getStats(task.getUser());

        if (task.getStatus() == Status.COMPLETED) {
            stats.updateTasksCompletedCount(-1);
            stats.updateTotalPoints(-task.getAwardedPoints());
        }

        stats.updateTaskCreatedCount(-1);
    }

    @Transactional
    public void taskNotComplete(Task task) {
            UserStats stats = statsService.getStats(task.getUser());

            stats.updateTasksCompletedCount(-1);
            stats.updateTotalPoints(-task.getAwardedPoints());
    }

    @Transactional
    public void updateFriendCount(User user, int d) {
        UserStats stats = statsService.getStats(user);
        stats.updateFriendCount(d);
    }

    @Transactional
    public void updateCreatedTasks(User user, int d) {
        UserStats stats = statsService.getStats(user);
        stats.updateTaskCreatedCount(d);
    }
}
