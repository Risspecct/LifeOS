package users.java.LifeOS.friend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import users.java.LifeOS.user.User;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    boolean existsByUserOneAndUserTwo(User userOne, User userTwo);
    List<Friendship> findByUserOneOrUserTwo(User userOne, User userTwo);
    void deleteByUserOneAndUserTwo(User userOne, User userTwo);

    @Query("""
    SELECT COUNT(f)
    FROM Friendship f
    WHERE f.userOne = :user
       OR f.userTwo = :user
""")
    Long countFriends(@Param("user") User user);
}