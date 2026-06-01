package users.java.LifeOS.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import users.java.LifeOS.stats.StreakView;
import users.java.LifeOS.stats.UserStatsRepository;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.TaskRepository;
import users.java.LifeOS.task.TaskService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Component
public class NotificationScheduler {
    private final TaskRepository taskRepository;
    private final TaskService taskService;
    private final NotificationService notificationService;
    private final UserStatsRepository statsRepository;
    private final NotificationRepository notificationRepository;

    @Scheduled(cron = "0 0 * * * *")
    public void generateDeadlineNotifications() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next24Hours = now.plusHours(24);
        List<Task> tasks = taskRepository.findTasksByDueDateBetween(now, next24Hours);

        for (Task task : tasks) {
            notificationService.createNotification(
                    task.getUser(),
                    NotificationType.TASK_DUE_SOON,
                    "Task Due Soon",
                    task.getTitle() + " is due today",
                    Map.of(
                            "taskId", task.getId(),
                            "dueDate", task.getDueDate().toString()
                    )
            );
        }
    }

    @Scheduled(cron = "0 0 * * * *")
    public void generateOverdueNotifications() {
        List<Task> tasks = taskRepository.findOverdueTasks(LocalDateTime.now());

        for (Task task: tasks) {
            notificationService.createNotification(
                    task.getUser(),
                    NotificationType.TASK_OVERDUE,
                    "Task Overdue",
                    task.getTitle() + " is overdue",
                    Map.of(
                            "taskId", task.getId(),
                            "dueDate", task.getDueDate().toString()
                    )
            );
        }
    }

    @Scheduled(cron = "0 0 20 * * *")
    public void generateStreakNotifications() {
        LocalDate today = LocalDate.now();
        List<StreakView> stats = statsRepository.findUsersStreakStatus();
        for (StreakView stat : stats) {
            if (stat.lastActiveDate() == null) {
                continue;
            }
            Long pendingTaskCount = taskService.getPendingTaskCount(stat.user());
            if (stat.currentStreak() >= 3
                    && stat.lastActiveDate().isBefore(today)
                    && !notificationService.hasNotificationToday(
                    stat.user().getId(),
                    NotificationType.STREAK_RISK
            )) {

                notificationService.createNotification(
                        stat.user(),
                        NotificationType.STREAK_RISK,
                        "Streak at Risk",
                        "Keep your " + stat.currentStreak()
                                + "-day streak alive. Complete a task today.",
                        Map.of(
                                "currentStreak",
                                stat.currentStreak()
                        )
                );
            }
            else if (stat.currentStreak() == 0
                    && pendingTaskCount > 0
                    && stat.lastActiveDate().isBefore(today)
                    && !notificationService.hasNotificationToday(stat.user().getId(), NotificationType.USER_INACTIVE)) {

                notificationService.createNotification(
                        stat.user(),
                        NotificationType.USER_INACTIVE,
                        "Pending Tasks Waiting",
                        "You have "
                                + pendingTaskCount
                                + " pending task"
                                + (pendingTaskCount == 1 ? "" : "s")
                                + " waiting for attention.",
                        Map.of(
                                "pendingTaskCount",
                                pendingTaskCount
                        )
                );
            }
        }
    }
 }