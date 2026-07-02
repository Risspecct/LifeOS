package users.java.LifeOS.feed;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import users.java.LifeOS.user.UserService;

import java.util.List;


@RequiredArgsConstructor
@RestController
@RequestMapping("/friends")
public class FriendFeedController {
    private final FriendFeedService friendFeedService;
    private final UserService userService;

    @GetMapping("/feed")
    public List<FriendActivityResponse> getFeed() {
        return friendFeedService.getFriendFeed(userService.getAuthenticatedUser());
    }
}
