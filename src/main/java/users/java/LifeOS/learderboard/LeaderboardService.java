package users.java.LifeOS.learderboard;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.friend.FriendDto;
import users.java.LifeOS.friend.FriendshipService;
import users.java.LifeOS.stats.UserStats;
import users.java.LifeOS.stats.UserStatsRepository;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserService;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.IntStream;

@RequiredArgsConstructor
@Service
public class LeaderboardService {
    private final UserService userService;
    private final UserStatsRepository userStatsRepository;
    private final FriendshipService friendshipService;

    public List<LeaderboardEntryDto> getLeaderboard() {

        List<UserStats> stats = userStatsRepository.findAll()
                        .stream()
                        .sorted( Comparator.comparing(UserStats::getTotalPoints).reversed() )
                        .toList();

        return buildLeaderboard(stats);
    }

    public List<LeaderboardEntryDto> getFriendLeaderboard() {
        User currentUser = userService.getAuthenticatedUser();
        Set<User> users = friendshipService.getFriendUsers(currentUser);
        users.add(currentUser);
        List<UserStats> stats = userStatsRepository.findByUserIn(users)
                        .stream()
                        .sorted(Comparator.comparing(UserStats::getTotalPoints).reversed())
                        .toList();
        return buildLeaderboard(stats);
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