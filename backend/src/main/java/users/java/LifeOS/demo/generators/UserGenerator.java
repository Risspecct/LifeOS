package users.java.LifeOS.demo.generators;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import users.java.LifeOS.auth.oauth.AuthProvider;
import users.java.LifeOS.branch.Branch;
import users.java.LifeOS.branch.BranchRepository;
import users.java.LifeOS.demo.config.DemoConfiguration;
import users.java.LifeOS.demo.context.GeneratedUser;
import users.java.LifeOS.demo.util.DemoConstants;
import users.java.LifeOS.demo.util.Identity;
import users.java.LifeOS.demo.util.IdentityGenerator;
import users.java.LifeOS.demo.util.RandomData;
import users.java.LifeOS.stats.UserStats;
import users.java.LifeOS.student.Student;
import users.java.LifeOS.user.User;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class UserGenerator {
    private final DemoConfiguration config;
    private final IdentityGenerator identityGenerator;
    private final PasswordEncoder passwordEncoder;
    private final BranchRepository branchRepository;
    private final RandomData randomData;

    private List<Branch> branches;

    public List<GeneratedUser> generate() {

        loadBranches();

        List<GeneratedUser> users = new ArrayList<>();

        users.add(createAdmin());
        users.add(createAlice());
        users.add(createBob());
        users.add(createCharlie());

        while (users.size() < config.getUsers()) {
            users.add(createRandomUser());
        }

        return users;
    }

    private void loadBranches() {

        branches = branchRepository.findAll();

        if (branches.isEmpty()) {
            throw new IllegalStateException(
                    "No branches found. Seed branches before generating demo users."
            );
        }
    }

    private GeneratedUser createAdmin() {
        return createUser(identityGenerator.admin(), "ADMIN");
    }

    private GeneratedUser createAlice() {
        return createUser(identityGenerator.alice(), "USER");
    }

    private GeneratedUser createBob() {
        return createUser(identityGenerator.bob(), "USER");
    }

    private GeneratedUser createCharlie() {
        return createUser(identityGenerator.charlie(), "USER");
    }

    private GeneratedUser createRandomUser() {
        return createUser(identityGenerator.random(), "USER");
    }

    private GeneratedUser createUser(
            Identity identity,
            String role
    ) {

        User user = buildUser(identity, role);

        Student student = buildStudent(user, identity);

        UserStats stats = buildStats(user);

        return new GeneratedUser(
                user,
                student,
                stats
        );
    }

    private User buildUser(
            Identity identity,
            String role
    ) {

        User user = new User();

        user.setUsername(identity.username());

        user.setEmail(identity.email());

        user.setPassword(
                passwordEncoder.encode(DemoConstants.DEFAULT_PASSWORD)
        );

        user.setRole(role);

        user.setProvider(AuthProvider.LOCAL);

        return user;
    }

    private Student buildStudent(User user, Identity identity) {

        Student student = new Student();

        student.setUser(user);

        student.setName(identity.fullName());

        student.setAge(identity.age());

        student.setCollege(identity.college());

        student.setYear(identity.year());

        student.setBio(identity.bio());

        student.setBranch(
                randomData.oneOf(branches)
        );

        return student;
    }

    private UserStats buildStats(User user) {

        UserStats stats = new UserStats(user);

        stats.setLastActiveDate(LocalDate.now());

        return stats;
    }
}