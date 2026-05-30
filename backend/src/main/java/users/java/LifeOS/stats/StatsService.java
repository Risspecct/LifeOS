package users.java.LifeOS.stats;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.user.User;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@RequiredArgsConstructor
@Service
public class StatsService {
    private final UserStatsRepository userStatsRepository;
    private final UserStatsMapper statsMapper;

    public UserStatsDto getUserStats(User user) {

        UserStats stats = userStatsRepository
                .findByUser(user)
                .orElseGet(() -> new UserStats(user));

        return statsMapper.toUserStatsDto(stats);
    }

    public Integer getCurrentStreak(User user) {
        UserStats stats = userStatsRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("No user stats found"));

        return calculateEffectiveStreak(stats);
    }

    private int calculateEffectiveStreak(UserStats stats) {
        if (stats.getLastActiveDate() == null) {
            return 0;
        }
        LocalDate today = LocalDate.now();
        long daysSinceLastActivity = ChronoUnit.DAYS.between(
                stats.getLastActiveDate(),
                today
        );
        if (daysSinceLastActivity > 1) {
            return 0;
        }
        return stats.getCurrentStreak();
    }
}