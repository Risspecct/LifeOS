package users.java.LifeOS.stats;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.user.User;

@RequiredArgsConstructor
@Service
public class StatsService {

    private final UserStatsRepository userStatsRepository;


    public UserStatsDto getUserStats(User user) {

        UserStats stats = userStatsRepository
                .findByUser(user)
                .orElseGet(() -> new UserStats(user));

        return new UserStatsDto(
                stats.getTotalPoints(),
                stats.getCurrentStreak(),
                stats.getLongestStreak(),
                stats.getTasksCompleted()
        );
    }
}