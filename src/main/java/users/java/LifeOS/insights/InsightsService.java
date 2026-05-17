package users.java.LifeOS.insights;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.activity.Activity;
import users.java.LifeOS.activity.ActivityRepository;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.TaskRepository;
import users.java.LifeOS.task.TaskService;
import users.java.LifeOS.task.prioritization.PriorityWeights;
import users.java.LifeOS.task.prioritization.TaskStats;
import users.java.LifeOS.user.UserService;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InsightsService {

    private static final double LABEL_WEIGHT_FACTOR = 0.7;
    private static final double PRIORITY_WEIGHT_FACTOR = 0.3;

    private static final int TIMELINE_LIMIT = 20;

    private final UserService userService;
    private final TaskService taskService;
    private final TaskRepository taskRepository;
    private final ActivityRepository activityRepository;

    public InsightsResponse getInsights(Long userId) {

        List<Task> tasks = taskRepository.findAllByUser_Id(userId);

        List<Activity> activities = activityRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return new InsightsResponse(
                buildSummary(tasks),
                buildHeatmap(tasks),
                buildWeeklyTrend(tasks),
                buildFocusDistribution(tasks),
                buildTimeline(activities)
        );
    }

    private ProductivitySummary buildSummary(List<Task> tasks) {

        TaskStats stats = taskService.getTaskStats(userService.getAuthenticatedUser());

        String topFocus = tasks.stream()
                        .filter(this::hasLabel)
                        .collect(Collectors.groupingBy(
                                task -> task.getLabel().getName(),
                                Collectors.summingInt(this::calculateTaskScore)
                        ))
                        .entrySet()
                        .stream()
                        .max(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElse("None");

        return new ProductivitySummary(
                stats.completedTasks(),
                stats.overdueTasks(),
                0,
                topFocus,
                "Moderate"
        );
    }

    private List<HeatmapDayDto> buildHeatmap(List<Task> tasks) {

        Map<LocalDate, Integer> scoreMap = new HashMap<>();

        for (Task task : tasks) {
            if (task.getCreatedAt() == null) continue;

            LocalDate date =
                    task.getCreatedAt().toLocalDate();

            scoreMap.merge(
                    date,
                    calculateTaskScore(task),
                    Integer::sum
            );
        }

        return scoreMap.entrySet()
                .stream()
                .map(entry ->
                        new HeatmapDayDto(
                                entry.getKey(),
                                entry.getValue()
                        )
                )
                .toList();
    }

    private List<WeeklyTrendDto> buildWeeklyTrend(List<Task> tasks) {

        Map<String, Integer> trendMap = initializeWeeklyTrendMap();

        for (Task task : tasks) {
            if (task.getCreatedAt() == null) continue;
            String day = getShortDayName(task);

            trendMap.merge(
                    day,
                    calculateTaskScore(task),
                    Integer::sum
            );
        }

        return trendMap.entrySet()
                .stream()
                .map(entry ->
                        new WeeklyTrendDto(
                                entry.getKey(),
                                entry.getValue()
                        )
                )
                .toList();
    }

    private List<FocusDistributionDto> buildFocusDistribution(
            List<Task> tasks
    ) {

        Map<String, Integer> distribution = new HashMap<>();

        for (Task task : tasks) {
            if (!hasLabel(task)) continue;
            distribution.merge(
                    task.getLabel().getName(),
                    calculateTaskScore(task),
                    Integer::sum
            );
        }

        int total = distribution.values()
                        .stream()
                        .mapToInt(Integer::intValue)
                        .sum();

        return distribution.entrySet()
                .stream()
                .map(entry ->
                        new FocusDistributionDto(
                                entry.getKey(),
                                calculatePercentage(
                                        entry.getValue(),
                                        total
                                )
                        )
                )
                .toList();
    }

    private List<ActivityTimelineDto> buildTimeline( List<Activity> activities ) {

        return activities.stream()
                .limit(TIMELINE_LIMIT)
                .map(activity ->
                        new ActivityTimelineDto(
                                activity.getActivityType().name(),
                                activity.getDescription(),
                                activity.getPoints(),
                                activity.getCreatedAt()
                        )
                )
                .toList();
    }

    // HELPER METHODS
    private int calculateTaskScore(Task task) {
        int labelWeight = getLabelWeight(task);
        int priorityWeight = getPriorityWeight(task);
        return (int) ((labelWeight * LABEL_WEIGHT_FACTOR) + (priorityWeight * PRIORITY_WEIGHT_FACTOR));
    }

    private int getLabelWeight(Task task) {
        return hasLabel(task) ? task.getLabel().getPriorityWeight() : 0;
    }

    private int getPriorityWeight(Task task) {
        return task.getManualPriority() != null ? PriorityWeights.getPriorityWeight(task.getManualPriority()) : 0;
    }

    private boolean hasLabel(Task task) {
        return task.getLabel() != null;
    }

    private String getShortDayName(Task task) {
        return task.getCreatedAt()
                .getDayOfWeek()
                .getDisplayName(
                        TextStyle.SHORT,
                        Locale.ENGLISH
                );
    }

    private Map<String, Integer> initializeWeeklyTrendMap() {
        Map<String, Integer> trendMap =
                new LinkedHashMap<>();
        trendMap.put("Mon", 0);
        trendMap.put("Tue", 0);
        trendMap.put("Wed", 0);
        trendMap.put("Thu", 0);
        trendMap.put("Fri", 0);
        trendMap.put("Sat", 0);
        trendMap.put("Sun", 0);

        return trendMap;
    }

    private double calculatePercentage( int value,int total) {
        if (total == 0) {
            return 0;
        }
        return (value * 100.0) / total;
    }
}