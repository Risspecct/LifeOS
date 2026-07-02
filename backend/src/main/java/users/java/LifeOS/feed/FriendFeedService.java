package users.java.LifeOS.feed;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.activity.ActivityRepository;
import users.java.LifeOS.activity.ActivityTypes;
import users.java.LifeOS.friend.FriendDto;
import users.java.LifeOS.friend.FriendshipService;
import users.java.LifeOS.user.User;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendFeedService {

    private final FriendshipService friendshipService;
    private final ActivityRepository activityRepository;
    private final FriendFeedMapper friendFeedMapper;

    public List<FriendActivityResponse> getFriendFeed(User user) {

        List<Long> friendIds = friendshipService
                .getFriends(user)
                .stream()
                .map(FriendDto::id)
                .toList();

        if (friendIds.isEmpty()) {
            return List.of();
        }

        return activityRepository
                .findTop20ByUser_IdInAndActivityTypeInOrderByCreatedAtDesc(
                        friendIds,
                        ActivityTypes.friendHighlights()
                )
                .stream()
                .map(friendFeedMapper::toResponse)
                .toList();
    }
}