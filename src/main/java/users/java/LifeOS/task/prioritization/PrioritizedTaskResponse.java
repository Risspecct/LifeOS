package users.java.LifeOS.task.prioritization;

import users.java.LifeOS.task.Status;

import java.time.LocalDateTime;
import java.util.List;

public record PrioritizedTaskResponse(

        Long id,

        String title,

        String description,

        Status status,

        LocalDateTime dueDate,

        Integer priorityScore,

        SmartPriorityLevel smartPriority,

        List<String> reasons
) {}