package users.java.LifeOS.note;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import users.java.LifeOS.user.User;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    Boolean existsByUserAndTitle(User user, String title);
}
