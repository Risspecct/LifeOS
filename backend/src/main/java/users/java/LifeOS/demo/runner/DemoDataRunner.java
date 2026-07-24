package users.java.LifeOS.demo.runner;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import users.java.LifeOS.demo.config.DemoConfiguration;
import users.java.LifeOS.demo.context.DemoContext;
import users.java.LifeOS.demo.context.GeneratedUser;
import users.java.LifeOS.demo.generators.FriendshipGenerator;
import users.java.LifeOS.demo.generators.LabelGenerator;
import users.java.LifeOS.demo.generators.TaskGenerator;
import users.java.LifeOS.demo.generators.UserGenerator;
import users.java.LifeOS.friend.Friendship;
import users.java.LifeOS.friend.FriendshipRepository;
import users.java.LifeOS.stats.UserStatsRepository;
import users.java.LifeOS.student.StudentRepository;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.TaskRepository;
import users.java.LifeOS.task.label.Label;
import users.java.LifeOS.task.label.LabelRepository;
import users.java.LifeOS.user.UserRepository;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DemoDataRunner implements CommandLineRunner {

    private final DemoConfiguration config;
    private final UserGenerator userGenerator;
    private final FriendshipGenerator friendshipGenerator;
    private final LabelGenerator labelGenerator;
    private final TaskGenerator taskGenerator;

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final UserStatsRepository userStatsRepository;
    private final FriendshipRepository friendshipRepository;
    private final LabelRepository labelRepository;
    private final TaskRepository taskRepository;

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
        labelGenerator.generate(context);
        taskGenerator.generate(context);

        saveStudents(context.getUsers());
        saveStats(context.getUsers());
        saveFriendships(context.getFriendships());
        saveLabels(context.getLabels());
        saveTasks(context.getTasks());

        System.out.printf(
                "Generated %d demo users, %d friendships, %d labels, and %d tasks%n",
                context.getUsers().size(),
                context.getFriendships().size(),
                context.getLabels().size(),
                context.getTasks().size()
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

    private void saveLabels(List<Label> labels) {
        labelRepository.saveAll(labels);
    }

    private void saveTasks(List<Task> tasks) {
        taskRepository.saveAll(tasks);
    }
}
