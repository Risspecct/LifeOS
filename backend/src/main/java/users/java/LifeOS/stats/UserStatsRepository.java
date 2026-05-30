package users.java.LifeOS.stats;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import users.java.LifeOS.user.User;

import java.time.LocalDate;
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
""")
    List<StreakView> findUsersStreakStatus();

    @Modifying
    @Transactional
    @Query("""
    UPDATE UserStats us
    SET us.currentStreak = 0
    WHERE us.currentStreak > 0
    AND us.lastActiveDate < :cutoffDate""")
    int resetBrokenStreaks(@Param("cutoffDate") LocalDate cutoffDate);
}
