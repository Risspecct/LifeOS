package users.java.LifeOS.rewards;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.TaskRepository;
import users.java.LifeOS.user.User;

import java.util.List;

@RequiredArgsConstructor
@Service
public class RewardStatsService {

    private final TaskRepository taskRepository;
    private final RewardService rewardService;

    public RewardStats calculateRewardStats(User user) {

        List<Task> completedTasks =
                taskRepository.findCompletedTasks(user);

        long totalPoints = completedTasks.stream()
                .mapToLong(rewardService::calculateTaskCompletionPoints)
                .sum();

        return new RewardStats(totalPoints);
    }
}