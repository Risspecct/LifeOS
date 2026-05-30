package users.java.LifeOS.stats;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@RequiredArgsConstructor
@Component
public class StreakScheduler {
    private final UserStatsRepository userStatsRepository;

    @Transactional
    @Scheduled(cron = "0 0 0 * * *")
    public void resetBrokenStreaks() {
        int updated = userStatsRepository.resetBrokenStreaks(LocalDate.now().minusDays(1));
        log.info("Reset {} broken streaks", updated);
    }
}