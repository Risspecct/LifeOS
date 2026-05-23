package users.java.LifeOS.friend.request;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.exceptions.ConflictException;
import users.java.LifeOS.exceptions.InvalidRequestException;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.friend.FriendshipService;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendRequestService {
    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;
    private final FriendshipService friendshipService;
    private final FriendRequestMapper mapper;

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
        if(friendRequestRepository.existsBySenderAndReceiver(sender,receiver)) {
            throw new ConflictException("Friend request already exists");
        }

        friendRequestRepository.save(new FriendRequest(sender, receiver));
    }

    @Transactional
    public void acceptRequest(User currentUser, Long requestId) {

        FriendRequest request = friendRequestRepository.findById(requestId)
                        .orElseThrow(() -> new NotFoundException("Request not found"));

        if(!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized action");
        }
        request.setStatus(FriendRequestStatus.ACCEPTED);
        friendshipService.createFriendship(request.getSender(),request.getReceiver());
    }

    @Transactional
    public void rejectRequest(User currentUser,Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                        .orElseThrow(() -> new NotFoundException("Request not found"));

        if(!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized action");
        }
        request.setStatus(FriendRequestStatus.REJECTED);
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