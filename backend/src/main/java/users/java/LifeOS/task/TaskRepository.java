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
    List<Task> findTop5ByUserAndStatusNotInAndDueDateIsNotNullOrderByDueDateAsc(User user, Collection<Status> statuses);

    Long countByUser(User user);

    Long countByUserAndStatus(User user, Status status);

    Long countByUserAndStatusNotIn(User user, Collection<Status> statuses);

    @Query("""
        SELECT COUNT(t)
        FROM Task t
        WHERE t.user = :user
        AND t.status NOT IN :statuses
        AND t.dueDate IS NOT NULL
        AND t.dueDate < CURRENT_TIMESTAMP
    """)
    Long countOverdueTasks(@Param("user") User user, @Param("statuses") Collection<Status> statuses);

    List<Task> findTasksByDueDateBetween(LocalDateTime start, LocalDateTime end);
}
