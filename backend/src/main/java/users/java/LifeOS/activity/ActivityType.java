package users.java.LifeOS.activity;

public enum ActivityType {

    TASK_CREATED(true),
    TASK_UPDATED(true),
    TASK_COMPLETED(true),
    TASK_DELETED(false),

    NOTE_CREATED(false),
    NOTE_DELETED(false),


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