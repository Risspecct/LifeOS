package users.java.LifeOS.demo.generators;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import users.java.LifeOS.demo.catalog.TaskCatalog;
import users.java.LifeOS.demo.catalog.TaskDefinition;
import users.java.LifeOS.demo.config.DemoConfiguration;
import users.java.LifeOS.demo.context.DemoContext;
import users.java.LifeOS.demo.context.GeneratedUser;
import users.java.LifeOS.demo.util.DateGenerator;
import users.java.LifeOS.demo.util.RandomData;
import users.java.LifeOS.demo.util.WeightedItem;
import users.java.LifeOS.rewards.RewardCalculator;
import users.java.LifeOS.task.Status;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.TaskPriority;
import users.java.LifeOS.task.label.Label;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TaskGenerator {

    private static final double LABEL_PROBABILITY = 0.85;
    private static final double CATALOG_PRIORITY_PROBABILITY = 0.30;

    private static final List<WeightedItem<Status>> STATUS_WEIGHTS = List.of(
            new WeightedItem<>(Status.TO_DO, 40),
            new WeightedItem<>(Status.IN_PROGRESS, 20),
            new WeightedItem<>(Status.COMPLETED, 30),
            new WeightedItem<>(Status.PAUSED, 5),
            new WeightedItem<>(Status.CANCELLED, 5)
    );

    private static final List<WeightedItem<TaskPriority>> PRIORITY_WEIGHTS = List.of(
            new WeightedItem<>(TaskPriority.LOW, 35),
            new WeightedItem<>(TaskPriority.MEDIUM, 35),
            new WeightedItem<>(TaskPriority.HIGH, 20),
            new WeightedItem<>(TaskPriority.URGENT, 10)
    );

    private final DemoConfiguration config;
    private final RandomData randomData;
    private final DateGenerator dateGenerator;
    private final RewardCalculator rewardCalculator;

    public void generate(DemoContext context) {

        for (GeneratedUser user : context.getUsers()) {
            generateTasksForUser(user, context);
        }
    }

    private void generateTasksForUser(
            GeneratedUser user,
            DemoContext context
    ) {

        List<Label> userLabels = labelsForUser(user, context);

        selectDefinitions().stream()
                .map(definition -> createTask(definition, user, userLabels))
                .forEach(context.getTasks()::add);
    }

    private List<TaskDefinition> selectDefinitions() {

        List<TaskDefinition> availableDefinitions = new ArrayList<>(
                TaskCatalog.definitions()
        );

        int taskCount = randomData.between(
                config.getTaskMin(),
                config.getTaskMax()
        );

        List<TaskDefinition> selectedDefinitions = new ArrayList<>();

        while (selectedDefinitions.size() < taskCount
                && !availableDefinitions.isEmpty()) {
            TaskDefinition definition = randomData.oneOf(availableDefinitions);

            selectedDefinitions.add(definition);
            availableDefinitions.remove(definition);
        }

        return selectedDefinitions;
    }

    private Task createTask(
            TaskDefinition definition,
            GeneratedUser generatedUser,
            List<Label> userLabels
    ) {

        Status status = assignStatus();
        Label label = selectLabel(userLabels);
        LocalDateTime createdAt = assignCreatedAt(generatedUser, label);
        LocalDateTime completedAt = assignCompletedAt(status, createdAt);
        LocalDateTime dueDate = assignDueDate(status, createdAt, completedAt);
        LocalDateTime updatedAt = assignUpdatedAt(createdAt, completedAt);

        Task task = new Task();

        task.setUser(generatedUser.getUser());
        task.setTitle(definition.title());
        task.setDescription(definition.description());
        task.setTaskType(definition.taskType());
        task.setManualPriority(assignPriority(definition));
        task.setStatus(status);
        task.setDueDate(dueDate);
        task.setCompletedAt(completedAt);
        task.setLabel(label);
        dateGenerator.applyTimestamps(task, createdAt, updatedAt);
        task.setAwardedPoints(assignAwardedPoints(task));

        return task;
    }

    private LocalDateTime assignCreatedAt(
            GeneratedUser generatedUser,
            Label label
    ) {

        LocalDateTime earliest = generatedUser.getUser().getCreatedAt();

        if (label != null
                && label.getCreatedAt().isAfter(earliest)) {
            earliest = label.getCreatedAt();
        }

        return dateGenerator.randomTimelineDateAfter(
                earliest,
                LocalDateTime.now().minusHours(1),
                30
        );
    }

    private Status assignStatus() {
        return randomData.weighted(STATUS_WEIGHTS);
    }

    private LocalDateTime assignDueDate(
            Status status,
            LocalDateTime createdAt,
            LocalDateTime completedAt
    ) {

        if (status == Status.COMPLETED) {
            return dateGenerator.randomDueDateForCompletion(createdAt, completedAt);
        }

        int bucket = randomData.between(1, 100);

        if (bucket <= 15) {
            return null;
        }

        if (bucket <= 30) {
            return overdueDueDate(createdAt);
        }

        if (bucket <= 40) {
            return LocalDateTime.now()
                    .plusHours(randomData.between(0, 18))
                    .plusMinutes(randomData.between(0, 59));
        }

        if (bucket <= 75) {
            return dateGenerator.randomFutureDays(7);
        }

        return dateGenerator.randomFutureDays(45);
    }

    private LocalDateTime overdueDueDate(LocalDateTime createdAt) {

        LocalDateTime latestDueDate = LocalDateTime.now()
                .minusMinutes(30);

        if (!createdAt.isBefore(latestDueDate)) {
            return latestDueDate;
        }

        return dateGenerator.between(createdAt, latestDueDate);
    }

    private LocalDateTime assignCompletedAt(
            Status status,
            LocalDateTime createdAt
    ) {

        if (status != Status.COMPLETED) {
            return null;
        }

        return dateGenerator.randomTimelineDateAfter(
                createdAt,
                LocalDateTime.now(),
                30
        );
    }

    private LocalDateTime assignUpdatedAt(
            LocalDateTime createdAt,
            LocalDateTime completedAt
    ) {

        if (completedAt != null) {
            return completedAt;
        }

        if (randomData.chance(0.40)) {
            return dateGenerator.randomTimelineDateAfter(createdAt, 15);
        }

        return createdAt;
    }

    private Long assignAwardedPoints(Task task) {

        if (task.getStatus() != Status.COMPLETED) {
            return 0L;
        }

        return rewardCalculator.calculateTaskCompletionPoints(task);
    }

    private TaskPriority assignPriority(TaskDefinition definition) {

        if (randomData.chance(CATALOG_PRIORITY_PROBABILITY)) {
            return definition.priority();
        }

        return randomData.weighted(PRIORITY_WEIGHTS);
    }

    private Label selectLabel(List<Label> userLabels) {

        if (userLabels.isEmpty()
                || !randomData.chance(LABEL_PROBABILITY)) {
            return null;
        }

        return randomData.oneOf(userLabels);
    }

    private List<Label> labelsForUser(
            GeneratedUser user,
            DemoContext context
    ) {

        return context.getLabels().stream()
                .filter(label -> belongsToUser(label, user))
                .toList();
    }

    private boolean belongsToUser(
            Label label,
            GeneratedUser user
    ) {

        Long labelUserId = label.getUser().getId();
        Long userId = user.getUser().getId();

        return labelUserId != null
                && labelUserId.equals(userId);
    }
}
