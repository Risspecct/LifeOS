package users.java.LifeOS.activity;

public enum ActivityType {

    TASK_CREATED(true),
    TASK_UPDATED(true),
    TASK_COMPLETED(true),

    PROFILE_UPDATED(false),
    LOGIN(false),
    FRIEND_ADDED(false);

    private final boolean contributesToProductivity;

    ActivityType(boolean contributesToProductivity) {
        this.contributesToProductivity = contributesToProductivity;
    }

    public boolean contributesToProductivity() {
        return contributesToProductivity;
    }
}