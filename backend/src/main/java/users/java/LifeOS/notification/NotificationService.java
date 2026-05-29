package users.java.LifeOS.notification;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.user.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public void createNotification(User user, NotificationType type, String title, String message, Map<String, Object> metadata) {
        Notification notification = new Notification(user, type, title, message, metadata);
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 20))
                .stream()
                .map(notification -> new NotificationResponse(
                        notification.getId(),
                        notification.getType().name(),
                        notification.getTitle(),
                        notification.getMessage(),
                        notification.isRead(),
                        notification.getCreatedAt(),
                        notification.getMetadata()
                ))
                .toList();
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotFoundException("No such notification found"));

        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
}