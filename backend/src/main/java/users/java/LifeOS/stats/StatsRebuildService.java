package users.java.LifeOS.stats;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.activity.ActivityRepository;
import users.java.LifeOS.activity.ActivityStats;
import users.java.LifeOS.activity.ActivityTypes;
import users.java.LifeOS.friend.FriendshipRepository;
import users.java.LifeOS.task.TaskRepository;
import users.java.LifeOS.task.TaskStats;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserRepository;

import java.util.List;

@RequiredArgsConstructor
@Service
public class StatsRebuildService {
    private final UserRepository userRepository;
    private final UserStatsRepository userStatsRepository;
    private final FriendshipRepository friendshipRepository;
    private final TaskRepository taskRepository;
    private final ActivityRepository activityRepository;
    private final StreakService streakService;
    private final UserStatsMapper statsMapper;

    @Transactional
    public void rebuildUserStats(User user) {
        UserStats stats = userStatsRepository.findByUser(user)
                .orElseGet(() -> new UserStats(user));

        Long Totalpoints = taskRepository.getTotalPointsFromCompletedTasks(user);

        StreakStats streakStats = streakService.buildStreakStats(user);

        TaskStats taskStats = taskRepository.getTaskStats(user);
        Integer tasksCreated = taskStats.totalTasks().intValue();
        Integer tasksCompleted = taskStats.completedTasks().intValue();

        ActivityStats activityStats = activityRepository
                .getActivityStats(user.getId(), ActivityTypes.productiveActivities());

        Integer friendCount = friendshipRepository.countFriends(user).intValue();

        UserStatsBuildDto dto = new UserStatsBuildDto(
                Totalpoints,
                streakStats.currentStreak(),
                streakStats.longestStreak(),
                tasksCreated,
                tasksCompleted,
                activityStats.totalActiveDays().intValue(),
                activityStats.lastActiveDate() != null ? activityStats.lastActiveDate().toLocalDate() : null,
                friendCount
        );

        statsMapper.updateUserStats(dto, stats);
        userStatsRepository.save(stats);
    }

    public void rebuildAllUsers() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            rebuildUserStats(user);
        }
    }
}
