package users.java.LifeOS.friend;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import users.java.LifeOS.friend.request.FriendRequestService;
import users.java.LifeOS.user.UserService;

@RestController
@RequestMapping("/friends")
@RequiredArgsConstructor
public class FriendController {
    private final UserService userService;
    private final FriendRequestService friendRequestService;
    private final FriendshipService friendshipService;

    @PostMapping("/request/{receiverId}")
    public ResponseEntity<?> sendRequest(@PathVariable Long receiverId) {
        friendRequestService.sendRequest(userService.getAuthenticatedUser(), receiverId);
        return ResponseEntity.ok("Friend Request sent successfully");
    }

    @PostMapping("/request/{requestId}/accept")
    public ResponseEntity<?> acceptRequest(@PathVariable Long requestId) {
        friendRequestService.acceptRequest(userService.getAuthenticatedUser(), requestId);
        return ResponseEntity.ok("Friend Request Accepted");
    }

    @PostMapping("/request/{requestId}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long requestId) {
        friendRequestService.rejectRequest(userService.getAuthenticatedUser(), requestId);
        return ResponseEntity.ok("Rejected friend Request");
    }

    @GetMapping
    public ResponseEntity<?> getFriends() {
        return ResponseEntity.ok(friendshipService.getFriends(userService.getAuthenticatedUser()));
    }

    @DeleteMapping("/{friendId}")
    public ResponseEntity<?> removeFriend(@PathVariable Long friendId) {
        friendshipService.removeFriend(userService.getAuthenticatedUser(), friendId);
        return ResponseEntity.ok("Removed friend successfully");
    }

    @GetMapping("/requests/incoming")
    public ResponseEntity<?> incoming() {
        return ResponseEntity.ok(friendRequestService.getIncomingRequests(userService.getAuthenticatedUser()));
    }

    @GetMapping("/requests/outgoing")
    public ResponseEntity<?> outgoing() {
        return ResponseEntity.ok(friendRequestService.getOutgoingRequests(userService.getAuthenticatedUser()));
    }
}