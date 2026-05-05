package users.java.LifeOS.task;

import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserService;

import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserService userService;
    private final TaskMapper mapper;

    TaskService(TaskRepository taskRepository, UserService userService, TaskMapper mapper) {
        this.taskRepository = taskRepository;
        this.userService = userService;
        this.mapper = mapper;
    }

    public TaskView create(long userId, TaskDto dto) {
        User user = userService.getById(userId);
        Task task = mapper.toEntity(dto);

        task.setUser(user);

        taskRepository.save(task);
        return mapper.toTaskView(task);
    }

    public List<TaskListView> getAll(long userId) {
        List<TaskListView> tasks = taskRepository.findAllByUser_Id(userId);
        if (tasks.isEmpty())
            throw new NotFoundException("No tasks found!");
        return tasks;
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

    public TaskDetailView updateStatus(long userId, long taskId, Status status) {
        Task task = getTask(taskId);
        verifyAccess(userId, task);
        task.setStatus(status);
        taskRepository.save(task);

        return getTask(userId, taskId);
    }

    private void verifyAccess(long userId, Task task) {
        if (userId != task.getUser().getId())
            throw new AuthorizationDeniedException("Not allowed to access this resource");
    }
}
