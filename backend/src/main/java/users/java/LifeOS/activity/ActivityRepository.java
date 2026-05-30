package users.java.LifeOS.activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import users.java.LifeOS.user.User;

import java.time.LocalDate;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Activity> findTop10ByUser_IdOrderByCreatedAtDesc(long userId);

    @Query("""
    SELECT new users.java.LifeOS.activity.ActivityStats(
        MAX(a.createdAt),
        COUNT(DISTINCT CAST(a.createdAt AS LocalDate))
    )
    FROM Activity a
    WHERE a.user.id = :userId
    AND a.activityType IN :activityTypes
    """)
    ActivityStats getActivityStats(@Param("userId") Long userId, @Param("activityTypes") List<ActivityType> activityTypes);

    @Query("""
    SELECT DISTINCT CAST(a.createdAt AS LocalDate)
    FROM Activity a
    WHERE a.user = :user
    AND a.activityType IN :activityTypes
    ORDER BY CAST(a.createdAt AS LocalDate)
""")
    List<LocalDate> findProductiveDates(@Param("user") User user, @Param("activityTypes") List<ActivityType> productiveTypes);
}