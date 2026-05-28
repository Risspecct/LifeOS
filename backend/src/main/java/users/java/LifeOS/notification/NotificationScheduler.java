package users.java.LifeOS.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.TaskRepository;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Component
public class NotificationScheduler {

    private final TaskRepository taskRepository;
    private final NotificationService notificationService;

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
                    task.getTitle() + " is due at" + task.getDueDate().getHour()
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
                    task.getTitle() + " is overdue"
            );
        }
    }
}