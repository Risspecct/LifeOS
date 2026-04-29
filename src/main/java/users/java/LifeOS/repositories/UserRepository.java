package users.java.LifeOS.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import users.java.LifeOS.models.User;
import users.java.LifeOS.views.UserView;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<UserView> findUserById(long id);
    List<UserView> findALlBy();
    Boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

}
