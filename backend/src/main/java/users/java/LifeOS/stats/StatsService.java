package users.java.LifeOS.stats;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.user.User;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@RequiredArgsConstructor
@Service
public class StatsService {
    private final UserStatsRepository userStatsRepository;
    private final UserStatsMapper statsMapper;

    public UserStatsDto getUserStats(User user) {
        UserStats stats = getStats(user);

        return statsMapper.toUserStatsDto(stats);
    }

    @Transactional
    public UserStats getStats(User user) {
        return userStatsRepository
                .findByUser(user)
                .orElseGet(() -> userStatsRepository.save(new UserStats(user)));
    }

    @Transactional
    public UserStats ensureStats(User user) {
        return getStats(user);
    }

    @Transactional
    public UserStats save(UserStats stats) {
        return userStatsRepository.save(stats);
    }

    public Integer getCurrentStreak(User user) {
        UserStats stats = userStatsRepository.findByUser(user)
                .orElseGet(() -> new UserStats(user));

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
