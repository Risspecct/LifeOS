package users.java.LifeOS.notification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId, Pageable pageable);
    long countByUserIdAndIsReadFalse(Long userId);
    Boolean existsByUserIdAndTypeAndCreatedAtAfter(Long userId,NotificationType type, LocalDateTime date);

    @Modifying
    @Query("""
        UPDATE Notification n
        SET n.isRead = true,
            n.readAt = CURRENT_TIMESTAMP
        WHERE n.user.id = :userId
          AND n.isRead = false
    """)
    void markAllAsRead(@Param("userId") Long userId);
}