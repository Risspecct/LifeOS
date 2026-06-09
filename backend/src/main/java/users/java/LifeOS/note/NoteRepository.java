package users.java.LifeOS.note;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.user.User;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    Boolean existsByUserAndTitle(User user, String title);

    Boolean existsByUserAndTitleAndIdNot(User user, String title, Long id);

    List<Note> findAllByUser(User user);

    List<Note> findAllByTask(Task task);
}
