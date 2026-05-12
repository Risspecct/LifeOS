package users.java.LifeOS.task.prioritization;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.TaskRepository;
import users.java.LifeOS.task.TaskService;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserService;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PrioritizationService {

    private final TaskRepository taskRepository;
    private final UserService userService;
    private final TaskPriorityCalculator taskPriorityCalculator;
    private final PrioritizationMapper prioritizationMapper;

    public List<PrioritizedTaskResponse> getPrioritizedTasks() {
        User currentUser = userService.getById(userService.getUserId());
        List<Task> tasks = taskRepository.findAllByUser_Id(userService.getUserId());

        return tasks.stream()
                .map(task -> {

                    PriorityResult result =
                            taskPriorityCalculator.calculate(task);

                    return prioritizationMapper.toResponse(task, result);
                })
                .sorted(Comparator.comparing(
                        PrioritizedTaskResponse::priorityScore
                ).reversed())
                .toList();
    }
}