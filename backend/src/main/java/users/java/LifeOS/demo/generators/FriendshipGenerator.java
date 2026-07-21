package users.java.LifeOS.demo.generators;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import users.java.LifeOS.branch.Branch;
import users.java.LifeOS.demo.config.DemoConfiguration;
import users.java.LifeOS.demo.context.DemoContext;
import users.java.LifeOS.demo.context.GeneratedUser;
import users.java.LifeOS.demo.util.RandomData;
import users.java.LifeOS.friend.Friendship;
import users.java.LifeOS.student.Student;
import users.java.LifeOS.user.User;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class FriendshipGenerator {

    private final DemoConfiguration config;
    private final RandomData randomData;

    private Map<Branch, List<GeneratedUser>> usersByBranch;
    private Map<Integer, List<GeneratedUser>> usersByYear;
    private List<GeneratedUser> users;
    private Set<String> existingPairs;
    private Map<Long, Integer> friendCounts;

    public void generate(DemoContext context) {

        users = context.getUsers();

        if (users.size() < 2) {
            return;
        }

        buildIndexes();
        friendCounts = new HashMap<>();

        for (GeneratedUser user : users) {
            requirePersistedUser(user);
            friendCounts.put(user.getUser().getId(), 0);
        }

        existingPairs = context.getFriendships().stream()
                .map(friendship -> pairKey(friendship.getUserOne(), friendship.getUserTwo()))
                .collect(Collectors.toSet());

        context.getFriendships().forEach(friendship -> {
            incrementFriendCount(friendship.getUserOne());
            incrementFriendCount(friendship.getUserTwo());
        });

        for (GeneratedUser user : users) {
            generateFriendshipsForUser(user, context);
        }
    }

    private void buildIndexes() {

        usersByBranch = users.stream()
                .filter(user -> user.getStudent().getBranch() != null)
                .collect(Collectors.groupingBy(user -> user.getStudent().getBranch()));

        usersByYear = users.stream()
                .filter(user -> user.getStudent().getYear() != null)
                .collect(Collectors.groupingBy(user -> user.getStudent().getYear()));
    }

    private void generateFriendshipsForUser(
            GeneratedUser user,
            DemoContext context
    ) {

        int targetFriends = randomData.between(
                config.getFriendMin(),
                config.getFriendMax()
        );

        int attempts = 0;
        int maxAttempts = users.size() * 3;

        while (friendCounts.get(user.getUser().getId()) < targetFriends
                && attempts < maxAttempts) {
            attempts++;

            GeneratedUser candidate = selectCandidate(user);

            if (canBecomeFriends(user, candidate)) {
                createFriendship(user, candidate, context);
            }
        }
    }

    private GeneratedUser selectCandidate(GeneratedUser user) {

        int totalProbability = config.getSameBranchProbability()
                + config.getSameYearProbability()
                + config.getRandomProbability();

        int selectedProbability = randomData.between(1, totalProbability);

        if (selectedProbability <= config.getSameBranchProbability()) {
            return randomSameBranch(user);
        }

        if (selectedProbability <= config.getSameBranchProbability()
                + config.getSameYearProbability()) {
            return randomSameYear(user);
        }

        return randomRandom();
    }

    private GeneratedUser randomSameBranch(GeneratedUser user) {

        List<GeneratedUser> candidates = usersByBranch.getOrDefault(
                user.getStudent().getBranch(),
                List.of()
        );

        return randomFrom(candidates);
    }

    private GeneratedUser randomSameYear(GeneratedUser user) {

        List<GeneratedUser> candidates = usersByYear.getOrDefault(
                user.getStudent().getYear(),
                List.of()
        );

        return randomFrom(
                candidates.stream()
                        .filter(candidate -> !sameBranch(user, candidate))
                        .toList()
        );
    }

    private GeneratedUser randomRandom() {
        return randomFrom(users);
    }

    private GeneratedUser randomFrom(List<GeneratedUser> candidates) {

        if (candidates.isEmpty()) {
            return null;
        }

        return randomData.oneOf(candidates);
    }

    private void createFriendship(
            GeneratedUser user,
            GeneratedUser candidate,
            DemoContext context
    ) {

        User first = firstUser(user.getUser(), candidate.getUser());
        User second = secondUser(user.getUser(), candidate.getUser());

        context.getFriendships().add(new Friendship(first, second));

        existingPairs.add(pairKey(first, second));
        incrementFriendCount(first);
        incrementFriendCount(second);
    }

    private boolean canBecomeFriends(
            GeneratedUser user,
            GeneratedUser candidate
    ) {

        if (candidate == null || user == candidate) {
            return false;
        }

        User first = firstUser(user.getUser(), candidate.getUser());
        User second = secondUser(user.getUser(), candidate.getUser());

        return !existingPairs.contains(pairKey(first, second))
                && friendCounts.get(first.getId()) < config.getFriendMax()
                && friendCounts.get(second.getId()) < config.getFriendMax();
    }

    private String pairKey(User first, User second) {
        return first.getId() + ":" + second.getId();
    }

    private void incrementFriendCount(User user) {
        friendCounts.compute(
                user.getId(),
                (id, count) -> count == null ? 1 : count + 1
        );
    }

    private User firstUser(User user, User candidate) {
        return user.getId() < candidate.getId() ? user : candidate;
    }

    private User secondUser(User user, User candidate) {
        return user.getId() < candidate.getId() ? candidate : user;
    }

    private boolean sameBranch(
            GeneratedUser user,
            GeneratedUser candidate
    ) {

        Student student = user.getStudent();
        Student candidateStudent = candidate.getStudent();

        return student.getBranch() != null
                && student.getBranch().equals(candidateStudent.getBranch());
    }

    private void requirePersistedUser(GeneratedUser generatedUser) {

        if (generatedUser.getUser().getId() == null) {
            throw new IllegalStateException(
                    "Users must be persisted before generating canonical friendships."
            );
        }
    }
}
