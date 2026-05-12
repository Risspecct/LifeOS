package users.java.LifeOS.task.prioritization;
import org.springframework.stereotype.Component;
import users.java.LifeOS.task.Status;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.label.Label;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Component
public class TaskPriorityCalculator {

    public PriorityResult calculate(Task task) {

        int score = 0;

        List<String> reasons = new ArrayList<>();

        // COMPLETED TASKS
        if (task.getStatus() == Status.COMPLETED) {
            score += PriorityWeights.STATUS_COMPLETED;
            reasons.add("Task already completed");
            return new PriorityResult(
                    score,
                    SmartPriorityLevel.LOW,
                    reasons
            );
        }

        // DUE DATE SCORE
        if (task.getDueDate() != null) {
            LocalDate today = LocalDate.now();
            LocalDate dueDate = task.getDueDate().toLocalDate();
            long daysBetween = ChronoUnit.DAYS.between(today, dueDate);
            if (daysBetween < 0) {
                score += PriorityWeights.OVERDUE;
                reasons.add("Task is overdue");
            } else if (daysBetween == 0) {
                score += PriorityWeights.DUE_TODAY;
                reasons.add("Due today");
            } else if (daysBetween == 1) {
                score += PriorityWeights.DUE_TOMORROW;
                reasons.add("Due tomorrow");
            } else if (daysBetween <= 3) {
                score += PriorityWeights.DUE_IN_3_DAYS;
                reasons.add("Due within 3 days");
            } else if (daysBetween <= 7) {
                score += PriorityWeights.DUE_IN_WEEK;
                reasons.add("Due within a week");
            }
        }

        // TASK STATUS
        if (task.getStatus() == Status.IN_PROGRESS) {
            score += PriorityWeights.STATUS_IN_PROGRESS;
            reasons.add("Task is in progress");
        } else if (task.getStatus() == Status.TO_DO) {
            score += PriorityWeights.STATUS_TODO;
            reasons.add("Task not started");
        }

        // MANUAL PRIORITY
        if (task.getManualPriority() != null) {
            switch (task.getManualPriority()) {
                case URGENT -> {
                    score += PriorityWeights.PRIORITY_URGENT;
                    reasons.add("Marked urgent");
                }
                case HIGH -> {
                    score += PriorityWeights.PRIORITY_HIGH;
                    reasons.add("Marked high priority");
                }
                case MEDIUM -> {
                    score += PriorityWeights.PRIORITY_MEDIUM;
                    reasons.add("Marked medium priority");
                }
                case LOW -> {
                    score += PriorityWeights.PRIORITY_LOW;
                    reasons.add("Marked low priority");
                }
            }
        }

        // LABEL WEIGHT
        Label label = task.getLabel();

        if (label != null && label.getPriorityWeight() != null) {
           score += label.getPriorityWeight();
            reasons.add(
                    "Label weight applied: " + label.getName()
            );
        }

        // SMART LEVEL
        SmartPriorityLevel level;
        if (score >= 80) {
            level = SmartPriorityLevel.CRITICAL;
        } else if (score >= 60) {
            level = SmartPriorityLevel.HIGH;
        } else if (score >= 35) {
            level = SmartPriorityLevel.MEDIUM;
        } else {
            level = SmartPriorityLevel.LOW;
        }
        return new PriorityResult(
                score,
                level,
                reasons
        );
    }
}