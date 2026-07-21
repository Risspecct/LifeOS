package users.java.LifeOS.demo.runner;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import users.java.LifeOS.demo.config.DemoConfiguration;
import users.java.LifeOS.demo.context.GeneratedUser;
import users.java.LifeOS.demo.generators.UserGenerator;
import users.java.LifeOS.stats.UserStatsRepository;
import users.java.LifeOS.student.StudentRepository;
import users.java.LifeOS.user.UserRepository;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DemoDataRunner implements CommandLineRunner {

    private final DemoConfiguration config;
    private final UserGenerator userGenerator;

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final UserStatsRepository userStatsRepository;

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

        List<GeneratedUser> users = userGenerator.generate();

        saveUsers(users);
        saveStudents(users);
        saveStats(users);

        System.out.printf("Generated %d demo users%n", users.size());
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
}