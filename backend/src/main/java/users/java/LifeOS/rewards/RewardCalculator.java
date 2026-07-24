package users.java.LifeOS.rewards;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.prioritization.SmartPriorityLevel;
import users.java.LifeOS.task.prioritization.TaskPriorityCalculator;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class RewardCalculator {

    private final TaskPriorityCalculator priorityCalculator;

    public long calculateTaskCompletionPoints(Task task) {
        SmartPriorityLevel level = priorityCalculator
                .determineLevel(priorityCalculator.calculateBaseScore(task));

        long points = switch (level) {
            case LOW -> RewardAction.LOW_PRIORITY_TASK.getPoints();
            case MEDIUM -> RewardAction.MEDIUM_PRIORITY_TASK.getPoints();
            case HIGH -> RewardAction.HIGH_PRIORITY_TASK.getPoints();
            case CRITICAL -> RewardAction.URGENT_PRIORITY_TASK.getPoints();
        };

        if (isCompletedEarly(task)) {
            points += RewardAction
                    .EARLY_COMPLETION_BONUS
                    .getPoints();
        }

        if (isSuspicious(task)) {
            points /= 2;
        }

        return points;
    }

    private boolean isCompletedEarly(Task task) {
        return task.getDueDate() != null
                && task.getCompletedAt() != null
                && task.getCompletedAt().isBefore(task.getDueDate());
    }

    private boolean isSuspicious(Task task) {

        if (task.getCreatedAt() == null
                || task.getCompletedAt() == null) {
            return false;
        }

        Duration duration = Duration.between(
                task.getCreatedAt(),
                task.getCompletedAt()
        );

        return duration.toMinutes() < 5;
    }
}
