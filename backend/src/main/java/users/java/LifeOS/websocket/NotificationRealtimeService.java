package users.java.LifeOS.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import users.java.LifeOS.notification.NotificationResponse;
import users.java.LifeOS.user.User;

@Service
@RequiredArgsConstructor
public class NotificationRealtimeService {

    private final SimpMessagingTemplate
            messagingTemplate;

    public void publish(User recipient, NotificationResponse dto) {

        messagingTemplate.convertAndSendToUser(
                        recipient.getEmail(),
                        "/queue/notifications",
                        dto
                );
    }
}