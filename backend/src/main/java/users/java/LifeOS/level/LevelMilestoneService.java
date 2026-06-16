package users.java.LifeOS.level;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.activity.Activity;
import users.java.LifeOS.activity.ActivityRepository;
import users.java.LifeOS.activity.ActivityType;
import users.java.LifeOS.user.User;

@Service
@RequiredArgsConstructor
public class LevelMilestoneService {
    private final ActivityRepository activityRepository;

    public void recordLevelUp(User user, int level) {

        Activity activity = Activity.builder()
                        .user(user)
                        .activityType(ActivityType.LEVEL_UP)
                        .title("Reached Level " + level)
                        .description("Reached Level " + level)
                        .points(0)
                        .build();

        activityRepository.save(activity);
    }
}