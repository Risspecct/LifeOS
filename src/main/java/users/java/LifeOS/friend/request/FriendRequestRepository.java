package users.java.LifeOS.friend.request;

import org.springframework.data.jpa.repository.JpaRepository;
import users.java.LifeOS.user.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    Optional<FriendRequest>
    findTopBySenderAndReceiverOrderByCreatedAtDesc(User sender, User receiver);
    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);
    List<FriendRequest> findByReceiverAndStatus(User receiver, FriendRequestStatus status);
    List<FriendRequest> findBySenderAndStatus(User sender, FriendRequestStatus status);
    boolean existsBySenderAndReceiver(User sender, User receiver);
    long countBySenderAndStatusAndResolvedAtAfter(User sender, FriendRequestStatus status, LocalDateTime resolvedAt);
}