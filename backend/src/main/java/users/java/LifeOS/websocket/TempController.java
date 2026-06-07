package users.java.LifeOS.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import users.java.LifeOS.user.UserService;

@RequiredArgsConstructor
@RestController
public class TempController {
    private final NotificationRealtimeService notificationRealtimeService;
    private final UserService userService;

    @PostMapping("/test-notification")
    public ResponseEntity<Void> test() {
        notificationRealtimeService.sendTestNotification(userService.getAuthenticatedUser().getEmail());
        return ResponseEntity.ok().build();
    }
}
