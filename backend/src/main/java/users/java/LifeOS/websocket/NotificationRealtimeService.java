package users.java.LifeOS.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationRealtimeService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendTestNotification(String email) {
        NotificationRealtimeDto dto = new NotificationRealtimeDto(
                        "Hello from WebSocket"
                );

        messagingTemplate.convertAndSendToUser(
                email,
                "/queue/notifications",
                dto
        );
    }
}