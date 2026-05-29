package users.java.LifeOS.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import users.java.LifeOS.stats.StreakView;
import users.java.LifeOS.stats.UserStats;
import users.java.LifeOS.stats.UserStatsRepository;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.TaskRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Component
public class NotificationScheduler {
    private final TaskRepository taskRepository;
    private final NotificationService notificationService;
    private final UserStatsRepository statsRepository;

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
        List<Task> tasks = taskRepository.findTasksByDueDateBefore(LocalDateTime.now());

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
        List<StreakView> stats = statsRepository.findUsersStreakStatus(3);

        for (StreakView stat: stats) {
            if (!stat.lastActiveDate().isEqual(LocalDate.now()))
               notificationService.createNotification(
                       stat.user(),
                       NotificationType.STREAK_RISK,
                       "Streak is in danger",
                       "Keep your " + stat.currentStreak() + " day streak going",
                       Map.of(
                               "currentStreak", stat.currentStreak()
                       )
               );
        }
    }
 }