package users.java.LifeOS.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserService;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> getNotifications() {
        return ResponseEntity.ok(notificationService.getUserNotifications(userService.getUserId()));
    }

    @PatchMapping("/{notificationId}/read")
    public void markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        return ResponseEntity.ok(notificationService.getUnreadCount(userService.getUserId()));
    }
}