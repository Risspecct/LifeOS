package users.java.LifeOS.rewards;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.stats.StreakService;
import users.java.LifeOS.stats.UserStats;
import users.java.LifeOS.stats.UserStatsRepository;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.prioritization.SmartPriorityLevel;
import users.java.LifeOS.task.prioritization.TaskPriorityCalculator;
import users.java.LifeOS.user.User;

import java.time.Duration;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class RewardService {

    private final UserStatsRepository userStatsRepository;
    private final TaskPriorityCalculator priorityCalculator;

    private final StreakService streakService;

    public void rewardTaskCompletion(User user,Task task) {

        UserStats stats = userStatsRepository.findByUser(user)
                .orElseGet(() -> new UserStats(user));

        long earnedPoints = calculateTaskCompletionPoints(task);

        stats.addPoints(earnedPoints);
        stats.incrementTasksCompleted();

        streakService.updateStreak(stats);
        userStatsRepository.save(stats);
    }

    private long calculateTaskCompletionPoints(Task task) {
        SmartPriorityLevel level = priorityCalculator
                .determineLevel(priorityCalculator.calculateBaseScore(task));


        long points = switch(level) {
            case SmartPriorityLevel.LOW -> RewardAction.LOW_PRIORITY_TASK.getPoints();
            case SmartPriorityLevel.MEDIUM -> RewardAction.MEDIUM_PRIORITY_TASK.getPoints();
            case SmartPriorityLevel.HIGH -> RewardAction.HIGH_PRIORITY_TASK.getPoints();
            case SmartPriorityLevel.CRITICAL -> RewardAction.URGENT_PRIORITY_TASK.getPoints();
        };

        if(isCompletedEarly(task)) {
            points += RewardAction
                    .EARLY_COMPLETION_BONUS
                    .getPoints();
        }
        if(isSuspicious(task)) {
            points /= 2;
        }
        return points;
    }

    private boolean isCompletedEarly(Task task) {
        return task.getDueDate() != null &&
                LocalDateTime.now().isBefore(task.getDueDate());
    }

    private boolean isSuspicious(Task task) {
        Duration duration = Duration.between(
                task.getCreatedAt(),
                LocalDateTime.now()
        );
        return duration.toMinutes() < 5;
    }
}