package users.java.LifeOS.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import users.java.LifeOS.user.User;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    List<Task> findAllByUser_Id(long userId);
    List<Task> findTop5ByUserAndStatusNotInAndDueDateIsNotNullOrderByDueDateAsc(
            User user,
            Collection<Status> statuses
    );
}
