package users.java.LifeOS.activity;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

public final class ActivityTypes {
    private ActivityTypes() {}

    public static List<ActivityType> productiveActivities() {
        return Arrays.stream(ActivityType.values())
                .filter(ActivityType::contributesToProductivity)
                .toList();
    }

    public static Set<ActivityType> friendHighlights() {
        return Set.of(
                ActivityType.LEVEL_UP,
                ActivityType.STREAK_MILESTONE,
                ActivityType.PRODUCTIVITY_MILESTONE
        );
    }
}