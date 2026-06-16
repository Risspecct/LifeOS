package users.java.LifeOS.level;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import users.java.LifeOS.stats.StatsService;
import users.java.LifeOS.stats.UserStats;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserService;

@RestController
@RequestMapping("/api/levels")
@RequiredArgsConstructor
public class LevelController {

    private final UserService userService;
    private final StatsService statsService;
    private final LevelService levelService;

    @GetMapping("/me")
    public UserLevelResponse getMyLevel() {

        User user = userService.getAuthenticatedUser();

        UserStats stats = statsService.getStats(user);

        long totalPoints = stats.getTotalPoints();

        int level = levelService.getLevel(totalPoints);

        long currentLevelPoints = levelService.getPointsForCurrentLevel(level);

        long nextLevelPoints = levelService.getPointsForNextLevel(level);

        return new UserLevelResponse(
                level,
                totalPoints,
                totalPoints - currentLevelPoints,
                nextLevelPoints - currentLevelPoints
        );
    }
}