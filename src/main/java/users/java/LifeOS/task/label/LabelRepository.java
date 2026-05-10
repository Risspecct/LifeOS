package users.java.LifeOS.task.label;

import org.springframework.data.jpa.repository.JpaRepository;
import users.java.LifeOS.user.User;

import java.util.List;
import java.util.Optional;

public interface LabelRepository extends JpaRepository<Label, Long> {

    List<Label> findAllByUserOrderByNameAsc(User user);

    Optional<Label> findByIdAndUser(Long id, User user);

    boolean existsByNameIgnoreCaseAndUser(String name, User user);
}