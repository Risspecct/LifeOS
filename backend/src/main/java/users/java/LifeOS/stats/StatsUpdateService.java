package users.java.LifeOS.stats;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.user.User;

@AllArgsConstructor
@Service
public class StatsUpdateService {
    private final StatsService statsService;
    private final StreakService streakService;

    @Transactional
    public void taskCompleted(User user, long points) {
        UserStats stats = statsService.getStats(user);

        stats.addPoints(points);
        stats.incrementTasksCompleted();

        streakService.updateStreak(stats);
    }

    @Transactional
    public void updateFriendCount(User user, int d) {
        UserStats stats = statsService.getStats(user);

        if (d == 1)
            stats.incrementFriendCount();
        else
            stats.decrementFriendCount();
    }

    @Transactional
    public void updateCreatedTasks(User user, int d) {
        UserStats stats = statsService.getStats(user);
        if (d == 1) {
            stats.incrementTasksCreated();
        } else
            stats.decrementTasksCreated();
    }
}
