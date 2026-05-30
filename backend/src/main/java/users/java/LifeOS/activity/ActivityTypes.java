package users.java.LifeOS.activity;

import java.util.Arrays;
import java.util.List;

public final class ActivityTypes {
    private ActivityTypes() {}

    public static List<ActivityType> productiveActivities() {
        return Arrays.stream(ActivityType.values())
                .filter(ActivityType::contributesToProductivity)
                .toList();
    }
}