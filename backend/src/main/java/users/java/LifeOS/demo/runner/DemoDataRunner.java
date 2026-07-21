package users.java.LifeOS.demo.runner;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import users.java.LifeOS.demo.config.DemoConfiguration;
import users.java.LifeOS.demo.context.DemoContext;
import users.java.LifeOS.demo.context.GeneratedUser;
import users.java.LifeOS.demo.generators.FriendshipGenerator;
import users.java.LifeOS.demo.generators.UserGenerator;
import users.java.LifeOS.friend.Friendship;
import users.java.LifeOS.friend.FriendshipRepository;
import users.java.LifeOS.stats.UserStatsRepository;
import users.java.LifeOS.student.StudentRepository;
import users.java.LifeOS.user.UserRepository;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DemoDataRunner implements CommandLineRunner {

    private final DemoConfiguration config;
    private final UserGenerator userGenerator;
    private final FriendshipGenerator friendshipGenerator;

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final UserStatsRepository userStatsRepository;
    private final FriendshipRepository friendshipRepository;

    @Override
    @Transactional
    public void run(String... args) {

        if (!config.isEnabled()) {
            return;
        }

        // Don't generate twice
        if (userRepository.count() > 0) {
            return;
        }

        DemoContext context = new DemoContext();

        userGenerator.generate(context);

        saveUsers(context.getUsers());

        friendshipGenerator.generate(context);

        saveFriendships(context.getFriendships());
        saveStudents(context.getUsers());
        saveStats(context.getUsers());

        System.out.printf(
                "Generated %d demo users and %d friendships%n",
                context.getUsers().size(),
                context.getFriendships().size()
        );
    }

    private void saveUsers(List<GeneratedUser> users) {
        userRepository.saveAll(
                users.stream()
                        .map(GeneratedUser::getUser)
                        .toList()
        );
    }

    private void saveStudents(List<GeneratedUser> users) {
        studentRepository.saveAll(
                users.stream()
                        .map(GeneratedUser::getStudent)
                        .toList()
        );
    }

    private void saveStats(List<GeneratedUser> users) {
        userStatsRepository.saveAll(
                users.stream()
                        .map(GeneratedUser::getStats)
                        .toList()
        );
    }

    private void saveFriendships(List<Friendship> friendships) {
        friendshipRepository.saveAll(friendships);
    }
}
