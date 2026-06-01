package users.java.LifeOS.friend;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.friend.request.FriendRequest;
import users.java.LifeOS.friend.request.FriendRequestRepository;
import users.java.LifeOS.friend.request.FriendRequestStatus;
import users.java.LifeOS.user.User;

@Service
@RequiredArgsConstructor
public class RelationshipService {

    private final FriendshipService friendshipService;
    private final FriendRequestRepository friendRequestRepository;

    public RelationshipInfo getRelationship(User currentUser, User targetUser) {

        if (currentUser.getId().equals(targetUser.getId())) {
            return new RelationshipInfo(
                    RelationshipStatus.SELF,
                    null
            );
        }

        if (friendshipService.isFriends(currentUser, targetUser)) {
            return new RelationshipInfo(
                    RelationshipStatus.FRIENDS,
                    null
            );
        }

        FriendRequest incomingRequest = friendRequestRepository
                        .findBySenderAndReceiverAndStatus(
                                targetUser,
                                currentUser,
                                FriendRequestStatus.PENDING
                        )
                        .orElse(null);

        if (incomingRequest != null) {
            return new RelationshipInfo(
                    RelationshipStatus.REQUEST_RECEIVED,
                    incomingRequest.getId()
            );
        }

        FriendRequest outgoingRequest = friendRequestRepository
                        .findBySenderAndReceiverAndStatus(
                                currentUser,
                                targetUser,
                                FriendRequestStatus.PENDING
                        )
                        .orElse(null);

        if (outgoingRequest != null) {
            return new RelationshipInfo(
                    RelationshipStatus.REQUEST_SENT,
                    outgoingRequest.getId()
            );
        }

        return new RelationshipInfo(
                RelationshipStatus.NOT_FRIENDS,
                null
        );
    }
}