package users.java.LifeOS.activity;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import users.java.LifeOS.user.UserService;

@RestController
@RequestMapping("/activities")
public class ActivityController {
    private final ActivityService activityService;
    private final UserService userService;

    ActivityController(ActivityService activityService, UserService userService) {
        this.activityService = activityService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> recentActivity() {
        return ResponseEntity.ok(activityService.getRecentActivities(userService.getUserId()));
    }
}
