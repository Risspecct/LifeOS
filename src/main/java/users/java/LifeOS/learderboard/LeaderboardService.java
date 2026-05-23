package users.java.LifeOS.learderboard;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.stats.UserStats;
import users.java.LifeOS.stats.UserStatsRepository;

import java.util.Comparator;
import java.util.List;
import java.util.stream.IntStream;

@RequiredArgsConstructor
@Service
public class LeaderboardService {

    private final UserStatsRepository userStatsRepository;

    public List<LeaderboardEntryDto> getLeaderboard() {

        List<UserStats> stats = userStatsRepository.findAll()
                        .stream()
                        .sorted( Comparator.comparing(UserStats::getTotalPoints).reversed() )
                        .toList();

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