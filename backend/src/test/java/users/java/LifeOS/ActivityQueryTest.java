package users.java.LifeOS;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import users.java.LifeOS.activity.ActivityRepository;
import users.java.LifeOS.activity.ActivityTypes;

@SpringBootTest
public class ActivityQueryTest {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private users.java.LifeOS.user.UserRepository userRepository;

    @Test
    @Transactional
    public void testQuery() {
        try {
            users.java.LifeOS.user.User user = userRepository.findById(1L).orElse(null);
            if (user != null) {
                activityRepository.findProductiveDates(user, ActivityTypes.productiveActivities());
                System.out.println("Query SUCCESS!");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}
