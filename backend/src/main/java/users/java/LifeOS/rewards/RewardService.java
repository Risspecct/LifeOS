package users.java.LifeOS.rewards;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.stats.StatsUpdateService;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.TaskRepository;
import users.java.LifeOS.user.User;

@RequiredArgsConstructor
@Service
public class RewardService {
    private final TaskRepository taskRepository;
    private final StatsUpdateService statsUpdateService;
    private final RewardCalculator rewardCalculator;

    public void rewardTaskCompletion(User user,Task task) {
        long earnedPoints = calculateTaskCompletionPoints(task);

        task.setAwardedPoints(earnedPoints);
        taskRepository.save(task);
        statsUpdateService.taskCompleted(user, earnedPoints);
    }

    public long calculateTaskCompletionPoints(Task task) {
        return rewardCalculator.calculateTaskCompletionPoints(task);
    }
}
