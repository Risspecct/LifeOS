package users.java.LifeOS.friend.request;

import java.time.LocalDateTime;

public record FriendRequestDto(
        Long requestId,
        Long senderId,
        String senderUsername,
        Long receiverId,
        String receiverUsername,
        String status,
        LocalDateTime createdAt
) {
}