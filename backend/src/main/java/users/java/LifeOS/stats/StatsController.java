package users.java.LifeOS.stats;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import users.java.LifeOS.user.UserService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/stats")
public class StatsController {
    private final StatsService statsService;
    private final UserService userService;
    private final StatsRebuildService statsRebuildService;

    @GetMapping("/me")
    public ResponseEntity<?> getMyStats() {
        return ResponseEntity.ok(statsService
                .getUserStats(userService.getAuthenticatedUser())
        );
    }

    @PostMapping("/rebuild/me")
    public void rebuildMyStats() {
        statsRebuildService.rebuildUserStats(
                userService.getAuthenticatedUser()
        );
    }

    @PostMapping("/rebuild/all")
    public void rebuildAllStats() {
        statsRebuildService.rebuildAllUsers();
    }
}