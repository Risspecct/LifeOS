package users.java.LifeOS.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<UserView> findUserById(long id);
    List<UserView> findALlBy();
    Boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}
