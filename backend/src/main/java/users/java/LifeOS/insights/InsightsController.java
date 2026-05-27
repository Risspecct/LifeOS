package users.java.LifeOS.insights;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import users.java.LifeOS.user.UserService;

@RestController
@RequestMapping("/insights")
@RequiredArgsConstructor
public class InsightsController {

    private final InsightsService productivityInsightsService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> getInsights() {
        return ResponseEntity.ok(productivityInsightsService.getInsights(userService.getUserId()));
    }
}