package users.java.LifeOS.stats;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class StatsRebuildScheduler {
    private final StatsRebuildService statsRebuildService;

    @Scheduled(cron = "0 0 3 * * *")
    public void rebuildAllStats() {
        statsRebuildService.rebuildAllUsers();
    }
}