package users.java.LifeOS.stats;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.activity.ActivityRepository;
import users.java.LifeOS.activity.ActivityTypes;
import users.java.LifeOS.user.User;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@Service
public class StreakService {
    private final ActivityRepository activityRepository;

    public StreakStats buildStreakStats(User user) {
        List<LocalDate> dates = activityRepository
                .findProductiveDates(user, ActivityTypes.productiveActivities());

        Integer currentStreak = calculateCurrentStreak(dates);
        Integer longestStreak = calculateLongestStreak(dates);

        return new StreakStats(
                currentStreak,
                longestStreak
        );
    }

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

    private int calculateLongestStreak(List<LocalDate> dates) {
        if (dates.isEmpty()) {
            return 0;
        }
        int longest = 1;
        int current = 1;
        for (int i = 1; i < dates.size(); i++) {
            if (dates.get(i - 1).plusDays(1).equals(dates.get(i))) {
                current++;
            } else {
                longest = Math.max(longest, current);
                current = 1;
            }
        }
        return Math.max(longest, current);
    }

    private int calculateCurrentStreak(List<LocalDate> dates) {
        if (dates.isEmpty()) {
            return 0;
        }
        LocalDate today = LocalDate.now();
        LocalDate lastDate = dates.getLast();

        if (lastDate.isBefore(today.minusDays(1))) {
            return 0;
        }

        int streak = 1;
        for (int i = dates.size() - 1; i > 0; i--) {
            if (dates.get(i - 1).plusDays(1).equals(dates.get(i))) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }
}