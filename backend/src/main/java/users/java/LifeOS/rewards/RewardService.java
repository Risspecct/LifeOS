package users.java.LifeOS.rewards;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.stats.StatsUpdateService;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.TaskRepository;
import users.java.LifeOS.task.prioritization.SmartPriorityLevel;
import users.java.LifeOS.task.prioritization.TaskPriorityCalculator;
import users.java.LifeOS.user.User;

import java.time.Duration;

@RequiredArgsConstructor
@Service
public class RewardService {
    private final TaskRepository taskRepository;
    private final StatsUpdateService statsUpdateService;
    private final TaskPriorityCalculator priorityCalculator;

    public void rewardTaskCompletion(User user,Task task) {
        long earnedPoints = calculateTaskCompletionPoints(task);

        task.setAwardedPoints(earnedPoints);
        taskRepository.save(task);
        statsUpdateService.taskCompleted(user, earnedPoints);
    }

    public long calculateTaskCompletionPoints(Task task) {
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
                task.getCompletedAt() != null &&
                task.getCompletedAt().isBefore(task.getDueDate());
    }

    private boolean isSuspicious(Task task) {
        if (task.getCompletedAt() == null) {
            return false;
        }
        Duration duration = Duration.between(
                task.getCreatedAt(),
                task.getCompletedAt()
        );
        return duration.toMinutes() < 5;
    }
}