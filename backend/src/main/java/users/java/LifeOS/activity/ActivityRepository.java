package users.java.LifeOS.activity;

import org.springframework.data.jpa.repository.JpaRepository;
import users.java.LifeOS.user.User;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Activity> findTop10ByUser_IdOrderByCreatedAtDesc(long userId);
}