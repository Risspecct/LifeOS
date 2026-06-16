package users.java.LifeOS.level;

import org.springframework.stereotype.Service;

@Service
public class LevelService {

    private static final int POINTS_PER_LEVEL = 200;

    public int getLevel(long totalPoints) {
        return (int) (totalPoints / POINTS_PER_LEVEL) + 1;
    }

    public long getPointsForCurrentLevel(int level) {
        return (long) (level - 1) * POINTS_PER_LEVEL;
    }

    public long getPointsForNextLevel(int level) {
        return (long) level * POINTS_PER_LEVEL;
    }

    public boolean hasLevelledUp(long oldPoints, long newPoints) {
        return getLevel(newPoints) > getLevel(oldPoints);
    }
}