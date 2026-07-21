package users.java.LifeOS.demo.context;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import users.java.LifeOS.stats.UserStats;
import users.java.LifeOS.student.Student;
import users.java.LifeOS.user.User;

@Getter
@RequiredArgsConstructor
public class GeneratedUser {

    private final User user;
    private final Student student;
    private final UserStats stats;

}