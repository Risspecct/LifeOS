package users.java.LifeOS.rewards;

public enum RewardAction {

    LOW_PRIORITY_TASK(5),
    MEDIUM_PRIORITY_TASK(10),
    HIGH_PRIORITY_TASK(20),
    URGENT_PRIORITY_TASK(30),

    EARLY_COMPLETION_BONUS(10),
    DAILY_STREAK_BONUS(15),
    WEEKLY_STREAK_BONUS(50);

    private final int points;

    RewardAction(int points) {
        this.points = points;
    }

    public int getPoints() {
        return points;
    }
}
