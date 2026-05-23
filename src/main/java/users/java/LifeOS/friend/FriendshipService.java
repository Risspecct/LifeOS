package users.java.LifeOS.friend;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final FriendMapper friendMapper;

    public List<FriendDto> getFriends(User user) {
        return friendshipRepository
                .findByUserOneOrUserTwo(user, user)
                .stream()
                .map(friendship -> {
                    User friend = friendship.getUserOne().equals(user)? friendship.getUserTwo() : friendship.getUserOne();
                    return friendMapper.toDto(friend);
                })
                .toList();
    }

    public boolean isFriends(User user1, User user2) {
        return friendshipRepository.existsByUserOneAndUserTwo(user1, user2)
                ||
                friendshipRepository.existsByUserOneAndUserTwo(user2, user1);
    }

    public void createFriendship(User user1, User user2) {
        if(isFriends(user1, user2)) {
            return;
        }
        User first = user1.getId() < user2.getId()? user1 : user2;
        User second = user1.getId() < user2.getId() ? user2 : user1;

        friendshipRepository.save(new Friendship(first, second));
    }

    @Transactional
    public void removeFriend(User currentUser, Long friendId) {

        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new NotFoundException("Friend not found"));

        User first = currentUser.getId() < friend.getId()? currentUser : friend;
        User second = currentUser.getId() < friend.getId() ? friend : currentUser;
        if (friendshipRepository.existsByUserOneAndUserTwo(first, second))
            friendshipRepository.deleteByUserOneAndUserTwo(first, second);
        else
            throw new NotFoundException("Friendship doesn't exist");
    }
}