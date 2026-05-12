package users.java.LifeOS.activity;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import users.java.LifeOS.user.UserService;

@RestController
@AllArgsConstructor
@RequestMapping("/activities")
public class ActivityController {
    private final ActivityService activityService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> recentActivity() {
        return ResponseEntity.ok(activityService.getRecentActivities(userService.getUserId()));
    }
}
