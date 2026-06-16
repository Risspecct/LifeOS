package users.java.LifeOS.level;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.activity.ActivityService;
import users.java.LifeOS.user.User;

@Service
@RequiredArgsConstructor
public class LevelProgressionService {
    private final LevelService levelService;
    private final ActivityService activityService;

    public void handleLevelProgression(User user, long oldPoints, long newPoints) {

        if (!levelService.hasLevelledUp(oldPoints, newPoints)) {
            return;
        }

        int level = levelService.getLevel(newPoints);

        activityService.createLevelUpActivity(user, level);
    }
}