package users.java.LifeOS.friend.request;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.exceptions.ConflictException;
import users.java.LifeOS.user.User;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FriendRequestValidationService {

    private final FriendRequestRepository friendRequestRepository;

    public void validateRequestEligibility(User sender, User receiver) {
        validateRecentRejectedLimits(sender);
        validateDuplicatePendingRequests( sender, receiver);
    }

    private void validateRecentRejectedLimits(User sender) {
        long rejectedToday = friendRequestRepository
                .countBySenderAndStatusAndResolvedAtAfter(sender, FriendRequestStatus.REJECTED, LocalDateTime.now().minusDays(1));

        if(rejectedToday >= FriendRequestLimits.MAX_REJECTED_PER_DAY) {
            throw new ConflictException("Too many rejected requests today");
        }

        long rejectedThisWeek = friendRequestRepository
                .countBySenderAndStatusAndResolvedAtAfter(sender, FriendRequestStatus.REJECTED, LocalDateTime.now().minusWeeks(1));

        if(rejectedThisWeek >= FriendRequestLimits.MAX_REJECTED_PER_WEEK) {
            throw new ConflictException("Too many rejected requests this week");
        }
    }

    private void validateDuplicatePendingRequests(User sender, User receiver) {
        FriendRequest latestRequest = friendRequestRepository.findTopBySenderAndReceiverOrderByCreatedAtDesc(sender, receiver)
                        .orElse(null);
        if(latestRequest == null) {
            return;
        }
        if(latestRequest.getStatus() == FriendRequestStatus.PENDING) {
            throw new ConflictException("Friend request already pending");
        }

        if(latestRequest.getStatus() == FriendRequestStatus.ACCEPTED) {
            throw new ConflictException( "Users are already connected");
        }
    }
}