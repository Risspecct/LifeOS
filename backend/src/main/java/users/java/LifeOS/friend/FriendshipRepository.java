package users.java.LifeOS.friend;

import org.springframework.data.jpa.repository.JpaRepository;
import users.java.LifeOS.user.User;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    boolean existsByUserOneAndUserTwo(User userOne, User userTwo);
    List<Friendship> findByUserOneOrUserTwo(User userOne, User userTwo);
    void deleteByUserOneAndUserTwo(User userOne, User userTwo);
}