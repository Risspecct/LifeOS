package users.java.LifeOS.friend.request;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.activity.ActivityService;
import users.java.LifeOS.exceptions.InvalidRequestException;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.friend.FriendshipService;
import users.java.LifeOS.notification.NotificationService;
import users.java.LifeOS.notification.NotificationType;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FriendRequestService {
    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;
    private final FriendshipService friendshipService;
    private final FriendRequestMapper mapper;
    private final FriendRequestValidationService validationService;
    private final ActivityService activityService;
    private final NotificationService notificationService;

    @Transactional
    public void sendRequest(User sender, Long receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new NotFoundException("Receiver not found"));

        if(sender.getId().equals(receiver.getId())) {
            throw new InvalidRequestException("You cannot send request to yourself");
        }

        if(friendshipService.isFriends(sender, receiver)) {
            throw new InvalidRequestException("Users are already friends");
        }

        validationService.validateRequestEligibility(sender, receiver);

        FriendRequest request = new FriendRequest(sender, receiver);

        friendRequestRepository.save(request);

        notificationService.createNotification(
                receiver,
                NotificationType.FRIEND_REQUEST_RECEIVED,
                "New Friend Request",
                sender.getUsername() + " sent you a friend request",
                Map.of(
                        "requestId", request.getId(),
                        "senderId", sender.getId()
                )
        );
    }

    @Transactional
    public void acceptRequest(User currentUser, Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                        .orElseThrow(() -> new NotFoundException("Request not found"));

        if(!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized action");
        }

        if (request.getStatus() == FriendRequestStatus.ACCEPTED)
            throw new InvalidRequestException("Friend request already accepted");

        request.setStatus(FriendRequestStatus.ACCEPTED);
        request.setResolvedAt(LocalDateTime.now());
        friendshipService.createFriendship(request.getSender(),request.getReceiver());

        notificationService.createNotification(
                request.getSender(),
                NotificationType.FRIEND_REQUEST_ACCEPTED,
                "Friend Added",
                request.getReceiver().getUsername() + " is added your social network",
                Map.of(
                        "friendId", request.getReceiver().getId()
                )
        );

        activityService.logFriendAdded(currentUser, request.getSender());
        activityService.logFriendAdded(request.getSender(), currentUser);
    }

    @Transactional
    public void rejectRequest(User currentUser,Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                        .orElseThrow(() -> new NotFoundException("Request not found"));

        if(!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized action");
        }
        request.setStatus(FriendRequestStatus.REJECTED);
        request.setResolvedAt(LocalDateTime.now());
    }

    public List<FriendRequestDto> getIncomingRequests(User user) {
        return friendRequestRepository
                .findByReceiverAndStatus(user, FriendRequestStatus.PENDING)
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public List<FriendRequestDto> getOutgoingRequests(User user) {
        return friendRequestRepository.findBySenderAndStatus(user, FriendRequestStatus.PENDING)
                .stream()
                .map(mapper::toDto)
                .toList();
    }
}