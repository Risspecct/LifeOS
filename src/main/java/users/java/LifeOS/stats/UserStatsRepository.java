package users.java.LifeOS.stats;

import org.springframework.data.jpa.repository.JpaRepository;
import users.java.LifeOS.user.User;

import java.util.List;
import java.util.Optional;

public interface UserStatsRepository extends JpaRepository<UserStats, Long> {
    Optional<UserStats> findByUser(User user);
    List<UserStats> findTop10ByOrderByTotalPointsDesc();
}
