package users.java.LifeOS.stats;

import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class StreakService {

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