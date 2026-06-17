package users.java.LifeOS.stats.streak;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.activity.ActivityService;
import users.java.LifeOS.activity.ActivityType;
import users.java.LifeOS.user.User;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class StreakMilestoneService {

    private static final Set<Integer> MILESTONES = Set.of(3, 7, 14, 30, 50, 75, 100);
    private final ActivityService activityService;

    public void checkMilestone(User user, int oldStreak, int newStreak) {

        if (oldStreak == newStreak) {
            return;
        }

        if (!MILESTONES.contains(newStreak)) {
            return;
        }

        activityService.logActivity(
                user,
                ActivityType.STREAK_MILESTONE,
                "Streak Milestone!",
                "Reached a "
                        + newStreak
                        + "-day streak",
                0,
                null
        );
    }
}