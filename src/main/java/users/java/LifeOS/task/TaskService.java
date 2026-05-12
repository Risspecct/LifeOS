package users.java.LifeOS.task;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;
import users.java.LifeOS.activity.ActivityPoints;
import users.java.LifeOS.activity.ActivityService;
import users.java.LifeOS.activity.ActivityType;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.task.label.Label;
import users.java.LifeOS.task.label.LabelService;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserService;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserService userService;
    private final TaskMapper mapper;
    private final ActivityService activityService;
    private final LabelService labelService;

    public TaskView create(long userId, TaskDto dto) {
        User user = userService.getById(userId);
        Task task = mapper.toEntity(dto);
        Label label = labelService.getLabelById(userId, dto.labelId());

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

        return mapper.toTaskView(task);
    }

    public List<TaskListView> getAll(long userId) {
        List<Task> tasks = taskRepository.findAllByUser_Id(userId);
        if (tasks.isEmpty())
            throw new NotFoundException("No tasks found!");


        return mapper.toTaskListViewList(tasks);
    }

    public TaskDetailView getTask(long userId, long taskId) {
        Task task = getTask(taskId);
        verifyAccess(userId, task);
        return mapper.toTaskDetailView(task);
    }

    private Task getTask(long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("No task found with given id"));
    }

    public TaskDetailView updateTask(long userId, long taskId, TaskUpdateDto dto) {
        Task task = getTask(taskId);
        verifyAccess(userId, task);
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

    public TaskDetailView updateStatus(long userId, long taskId, Status status) {
        Task task = getTask(taskId);
        verifyAccess(userId, task);
        task.setStatus(status);

        int points;
        if (status == Status.COMPLETED) {
            points = ActivityPoints.TASK_COMPLETED;
            task.setCompletedAt(LocalDateTime.now());
        }
        else
            points = ActivityPoints.TASK_UPDATED;

        activityService.logActivity(
                userService.getById(userId),
                ActivityType.TASK_UPDATED,
                "Updated Task status",
                task.getTitle(),
                points,
                task
        );

        taskRepository.save(task);
        return getTask(userId, taskId);
    }

    public List<TaskListView> getTasks(Long userId, Status status, String label, String taskType) {
        Specification<Task> spec = TaskSpecification.filterTasks(
                userId,
                status,
                label,
                taskType
        );
        List<Task> tasks = taskRepository.findAll(spec);
        return mapper.toTaskListViewList(tasks);
    }

    public void delete(long userId, long taskId) {
        Task task = getTask(taskId);
        verifyAccess(userId, task);

        taskRepository.delete(task);
    }

    private void verifyAccess(long userId, Task task) {
        if (userId != task.getUser().getId()) {
            log.error("Unauthorized access to the task with id: {}", task.getId());
            throw new AuthorizationDeniedException("Not allowed to access this resource");
        }
    }
}
