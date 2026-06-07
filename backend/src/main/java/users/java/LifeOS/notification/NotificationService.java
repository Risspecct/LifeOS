package users.java.LifeOS.notification;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.user.User;
import users.java.LifeOS.websocket.NotificationRealtimeService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final NotificationRealtimeService notificationRealtimeService;
    private final NotificationMapper notificationMapper;

    public void createNotification(User user, NotificationType type, String title, String message, Map<String, Object> metadata) {
        Notification notification = new Notification(user, type, title, message, metadata);
        notificationRepository.save(notification);

        if (shouldSendRealtime(type)) {
            NotificationResponse response = notificationMapper.toResponse(notification);

            notificationRealtimeService.publish(
                    user,
                    response
            );
        }

    }

    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId, PageRequest.of(0, 20))
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

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    public boolean hasNotificationToday(Long userId, NotificationType type) {
        return notificationRepository.existsByUserIdAndTypeAndCreatedAtAfter(userId, type, LocalDate.now().atStartOfDay());
    }

    private static final Set<NotificationType>
            REALTIME_NOTIFICATION_TYPES = EnumSet.of(
                    NotificationType.FRIEND_REQUEST_RECEIVED,
                    NotificationType.FRIEND_REQUEST_ACCEPTED
            );

    private boolean shouldSendRealtime(NotificationType type) {
        return REALTIME_NOTIFICATION_TYPES.contains(type);
    }
}