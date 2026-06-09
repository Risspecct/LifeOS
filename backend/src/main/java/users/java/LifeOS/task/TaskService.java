package users.java.LifeOS.task;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;
import users.java.LifeOS.activity.ActivityPoints;
import users.java.LifeOS.activity.ActivityService;
import users.java.LifeOS.activity.ActivityType;
import users.java.LifeOS.exceptions.InvalidRequestException;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.rewards.RewardService;
import users.java.LifeOS.stats.StatsUpdateService;
import users.java.LifeOS.task.label.Label;
import users.java.LifeOS.task.label.LabelService;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserService;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Slf4j
@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserService userService;
    private final TaskMapper mapper;
    private final ActivityService activityService;
    private final LabelService labelService;
    private final RewardService rewardService;
    private final StatsUpdateService statsUpdateService;

    public TaskView create(User user, TaskDto dto) {
        Task task = mapper.toEntity(dto);
        Label label = labelService.getLabelById(user.getId(), dto.labelId());

        if (dto.status() == null)
            task.setStatus(Status.TO_DO);
        if (dto.status() == Status.COMPLETED)
            task.setCompletedAt(LocalDateTime.now());

        task.setUser(user);
        task.setLabel(label);

        taskRepository.save(task);

        activityService.logActivity(
                user,
                ActivityType.TASK_CREATED,
                "Created a task",
                task.getTitle(),
                ActivityPoints.TASK_CREATED,
                task
        );

        statsUpdateService.updateCreatedTasks(user, 1);
        return mapper.toTaskView(task);
    }

    public List<TaskListView> getAll(long userId) {
        List<Task> tasks = taskRepository.findAllByUser_Id(userId);
        if (tasks.isEmpty())
            throw new NotFoundException("No tasks found!");


        return mapper.toTaskListViewList(tasks);
    }



    public TaskDetailView getTask(long userId, long taskId) {
        Task task = getVerifiedTask(userId, taskId);
        return mapper.toTaskDetailView(task);
    }

    public Task getVerifiedTask(Long userId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("No task found with given id"));

        verifyAccess(userId, task);
        return task;
    }

    public TaskDetailView updateTask(long userId, long taskId, TaskUpdateDto dto) {
        Task task = getVerifiedTask(userId, taskId);
        Task updatedTask = mapper.updateTask(dto, task);

        taskRepository.save(updatedTask);


        activityService.logActivity(
                userService.getById(userId),
                ActivityType.TASK_UPDATED,
                "Updated task details",
                task.getTitle(),
                ActivityPoints.TASK_UPDATED,
                task
        );

        return getTask(userId, taskId);
    }

    @Transactional
    public TaskDetailView updateStatus(User user, long taskId, Status status) {
        Task task = getVerifiedTask(user.getId(), taskId);

        if (task.getStatus() == status) {
            throw new InvalidRequestException("Updated status cannot be same as the present status");
        }

        ActivityType type;
        int points;

        if (status == Status.COMPLETED) {
            points = ActivityPoints.TASK_COMPLETED;
            type = ActivityType.TASK_COMPLETED;

            task.setCompletedAt(LocalDateTime.now());

            rewardService.rewardTaskCompletion(
                    userService.getAuthenticatedUser(),
                    task
            );

        } else {
            if (task.getStatus() == Status.COMPLETED) {
                statsUpdateService.taskNotComplete(task);

                task.setCompletedAt(null);
                task.setAwardedPoints(0L);
            }

            points = ActivityPoints.TASK_UPDATED;
            type = ActivityType.TASK_UPDATED;
        }

        task.setStatus(status);

        activityService.logActivity(
                user,
                type,
                "Updated Task status",
                task.getTitle(),
                points,
                task
        );

        taskRepository.save(task);

        return getTask(user.getId(), taskId);
    }

    public List<TaskListView> getTasks(Long userId, Status status, Long labelId, String taskType) {
        Specification<Task> spec = TaskSpecification.filterTasks(
                userId,
                status,
                labelId,
                taskType
        );
        List<Task> tasks = taskRepository.findAll(spec);
        return mapper.toTaskListViewList(tasks);
    }

    public List<UpcomingTaskDto> getUpcomingTasks(User currentUser) {

        return taskRepository
                .findTop5ByUserAndStatusNotInAndDueDateIsNotNullOrderByDueDateAsc(
                        currentUser,
                        List.of(
                                Status.COMPLETED,
                                Status.PAUSED
                        )
                )
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public Long getPendingTaskCount(User user) {
        return taskRepository.countByUserAndStatusNotIn(
                user,
                List.of(
                        Status.COMPLETED,
                        Status.CANCELLED
                )
        );
    }

    public TaskStats getTaskStats(User user) {
        return taskRepository.getTaskStats(user);
    }

    public void delete(long userId, long taskId) {
        Task task = getVerifiedTask(userId, taskId);

        taskRepository.delete(task);

        statsUpdateService.taskDeleted(task);
    }

    private void verifyAccess(long userId, Task task) {
        if (userId != task.getUser().getId()) {
            log.error("Unauthorized access to the task with id: {}", task.getId());
            throw new AuthorizationDeniedException("Not allowed to access this resource");
        }
    }
}
