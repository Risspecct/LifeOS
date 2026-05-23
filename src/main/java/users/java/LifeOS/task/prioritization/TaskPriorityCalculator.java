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

        int score = calculateBaseScore(task);
        List<String> reasons = buildReasons(task);
        SmartPriorityLevel level = determineLevel(score);

        if(task.getStatus() == Status.COMPLETED) {
            reasons.add("Task already completed");
            level = SmartPriorityLevel.LOW;
        }
        return new PriorityResult(
                score,
                level,
                reasons
        );
    }

    public int calculateBaseScore(Task task) {
        int score = 0;
        // DUE DATE SCORE
        if(task.getDueDate() != null) {
            LocalDate today = LocalDate.now();
            LocalDate dueDate = task.getDueDate().toLocalDate();
            long daysBetween = ChronoUnit.DAYS.between(today, dueDate);

            if(daysBetween < 0) {
                score += PriorityWeights.OVERDUE;
            }
            else if(daysBetween == 0) {
                score += PriorityWeights.DUE_TODAY;
            }
            else if(daysBetween == 1) {
                score += PriorityWeights.DUE_TOMORROW;
            }
            else if(daysBetween <= 3) {
                score += PriorityWeights.DUE_IN_3_DAYS;
            }
            else if(daysBetween <= 7) {
                score += PriorityWeights.DUE_IN_WEEK;
            }
        }

        // TASK STATUS
        if(task.getStatus() == Status.IN_PROGRESS) {
            score += PriorityWeights.STATUS_IN_PROGRESS;
        }
        else if(task.getStatus() == Status.TO_DO) {
            score += PriorityWeights.STATUS_TODO;
        }
        // MANUAL PRIORITY
        if(task.getManualPriority() != null) {
            switch(task.getManualPriority()) {
                case URGENT -> score += PriorityWeights.PRIORITY_URGENT;
                case HIGH -> score += PriorityWeights.PRIORITY_HIGH;
                case MEDIUM -> score += PriorityWeights.PRIORITY_MEDIUM;
                case LOW -> score += PriorityWeights.PRIORITY_LOW;
            }
        }

        // LABEL WEIGHT
        Label label = task.getLabel();
        if(label != null && label.getPriorityWeight() != null) {
            score += label.getPriorityWeight();
        }
        return score;
    }

    private List<String> buildReasons(Task task) {
        List<String> reasons = new ArrayList<>();
        // DUE DATE REASONS
        if(task.getDueDate() != null) {
            LocalDate today = LocalDate.now();
            LocalDate dueDate = task.getDueDate().toLocalDate();
            long daysBetween = ChronoUnit.DAYS.between(today,dueDate);

            if(daysBetween < 0) {
                reasons.add("Task is overdue");
            }
            else if(daysBetween == 0) {
                reasons.add("Due today");
            }
            else if(daysBetween == 1) {
                reasons.add("Due tomorrow");
            }
            else if(daysBetween <= 3) {
                reasons.add("Due within 3 days");
            }
            else if(daysBetween <= 7) {
                reasons.add("Due within a week");
            }
        }

        // STATUS REASONS
        if(task.getStatus() == Status.IN_PROGRESS) {
            reasons.add("Task is in progress");
        }
        else if(task.getStatus() == Status.TO_DO) {
            reasons.add("Task not started");
        }
        // MANUAL PRIORITY REASONS
        if(task.getManualPriority() != null) {
            switch(task.getManualPriority()) {
                case URGENT -> reasons.add("Marked urgent");
                case HIGH -> reasons.add("Marked high priority");
                case MEDIUM -> reasons.add("Marked medium priority");
                case LOW -> reasons.add("Marked low priority");
            }
        }

        // LABEL REASONS
        Label label = task.getLabel();
        if(label != null && label.getPriorityWeight() != null) {
            reasons.add("Label weight applied: " + label.getName());
        }

        return reasons;
    }

    public SmartPriorityLevel determineLevel(int score) {
        if(score >= 80) {
            return SmartPriorityLevel.CRITICAL;
        }
        else if(score >= 60) {
            return SmartPriorityLevel.HIGH;
        }
        else if(score >= 35) {
            return SmartPriorityLevel.MEDIUM;
        }
        return SmartPriorityLevel.LOW;
    }
}