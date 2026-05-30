package users.java.LifeOS.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import users.java.LifeOS.user.User;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    List<Task> findAllByUser_Id(long userId);

    @Query("""
    SELECT t
    FROM Task t
    WHERE t.user = :user
    AND t.status = users.java.LifeOS.task.Status.COMPLETED""")
    List<Task> findCompletedTasks(@Param("user") User user);

    List<Task> findTop5ByUserAndStatusNotInAndDueDateIsNotNullOrderByDueDateAsc(User user, Collection<Status> statuses);

    Long countByUserAndStatusNotIn(User user, Collection<Status> statuses);

    List<Task> findTasksByDueDateBetween(LocalDateTime start, LocalDateTime end);

    List<Task> findTasksByDueDateBefore(LocalDateTime time);

    @Query("""
SELECT new users.java.LifeOS.task.TaskStats(
    COUNT(t),
    COALESCE(SUM(
        CASE WHEN t.status = users.java.LifeOS.task.Status.COMPLETED
        THEN 1 ELSE 0 END
    ), 0),
    COALESCE(SUM(
        CASE WHEN t.status NOT IN (
            users.java.LifeOS.task.Status.COMPLETED,
            users.java.LifeOS.task.Status.CANCELLED
        )
        THEN 1 ELSE 0 END
    ), 0),
    COALESCE(SUM(
        CASE WHEN t.status NOT IN (
            users.java.LifeOS.task.Status.COMPLETED,
            users.java.LifeOS.task.Status.CANCELLED
        )
        AND t.dueDate < CURRENT_TIMESTAMP
        THEN 1 ELSE 0 END
    ), 0)
)
FROM Task t
WHERE t.user = :user
""")
    TaskStats getTaskStats(@Param("user") User user);
}
