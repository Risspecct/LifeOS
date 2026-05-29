package users.java.LifeOS.stats;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@Service
public class StreakService {
    private final UserStatsRepository statsRepository;

    public void updateStreak(UserStats stats) {
        LocalDate today = LocalDate.now();
        LocalDate lastActiveDate = stats.getLastActiveDate();

        if(lastActiveDate == null) {
            stats.setCurrentStreak(1);
        }
        else if(lastActiveDate.equals(today.minusDays(1))) {
            stats.setCurrentStreak(
                    stats.getCurrentStreak() + 1
            );
        }
        else if(!lastActiveDate.equals(today)) {
            stats.setCurrentStreak(1);
        }

        if(stats.getCurrentStreak() > stats.getLongestStreak()) {
            stats.setLongestStreak(stats.getCurrentStreak());
        }
        stats.setLastActiveDate(today);
    }
}