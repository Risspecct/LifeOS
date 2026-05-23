package users.java.LifeOS.stats;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import users.java.LifeOS.user.UserService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/stats")
public class StatsController {

    private final StatsService statsService;
    private final UserService userService;

    @GetMapping("/me")
    public UserStatsDto getMyStats() {

        return statsService.getUserStats(userService.getAuthenticatedUser());
    }
}