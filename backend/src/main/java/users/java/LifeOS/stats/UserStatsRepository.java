package users.java.LifeOS.stats;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import users.java.LifeOS.user.User;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface UserStatsRepository extends JpaRepository<UserStats, Long> {
    Optional<UserStats> findByUser(User user);
    List<UserStats> findTop10ByOrderByTotalPointsDesc();
    List<UserStats> findByUserIn(Collection<User> users);

    @Query("""
    SELECT new users.java.LifeOS.stats.StreakView(
        us.user,
        us.currentStreak,
        us.lastActiveDate
    )
    FROM UserStats us
    WHERE us.currentStreak >= :minimumStreak
""")
    List<StreakView> findUsersStreakStatus(@Param("minimumStreak") Integer minimumStreak);
}
