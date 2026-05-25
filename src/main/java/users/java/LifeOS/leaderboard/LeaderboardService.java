package users.java.LifeOS.leaderboard;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.friend.FriendshipService;
import users.java.LifeOS.stats.UserStats;
import users.java.LifeOS.stats.UserStatsRepository;
import users.java.LifeOS.student.Student;
import users.java.LifeOS.student.StudentRepository;
import users.java.LifeOS.student.StudentService;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserService;

import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class LeaderboardService {
    private final UserService userService;
    private final UserStatsRepository userStatsRepository;
    private final FriendshipService friendshipService;
    private final StudentService studentService;

    public List<LeaderboardEntryDto> getLeaderboard(LeaderboardScope scope) {
        User currentUser = userService.getAuthenticatedUser();
        List<UserStats> stats = switch(scope) {
            case GLOBAL -> getGlobalStats();
            case FRIENDS -> getFriendStats(currentUser);
            case COLLEGE -> getCollegeStats(currentUser);
        };
        return buildLeaderboard(stats);
    }

    private List<UserStats> getGlobalStats() {
        return sortStats(
                userStatsRepository.findAll()
        );
    }

    private List<UserStats> getFriendStats(User currentUser) {
        Set<User> users = friendshipService.getFriendUsers(currentUser);
        users.add(currentUser);
        return sortStats(userStatsRepository.findByUserIn(users));
    }

    private List<UserStats> getCollegeStats(User currentUser) {
        Student profile = studentService.getStudent(currentUser.getId());
        List<User> collegeUsers = studentService.getUsersByCollege(profile.getCollege());

        return sortStats(userStatsRepository.findByUserIn(collegeUsers));
    }

    private List<UserStats> sortStats(Collection<UserStats> stats) {
        return stats.stream()
                .sorted(Comparator.comparing(UserStats::getTotalPoints).reversed())
                .toList();
    }

    private List<LeaderboardEntryDto> buildLeaderboard(List<UserStats> stats) {
        return IntStream.range(0, stats.size())
                .mapToObj(index -> {
                    UserStats userStats = stats.get(index);
                    return new LeaderboardEntryDto(
                            userStats.getUser().getId(),
                            userStats.getUser().getUsername(),
                            userStats.getTotalPoints(),
                            userStats.getCurrentStreak(),
                            index + 1
                    );
                })
                .toList();
    }
}