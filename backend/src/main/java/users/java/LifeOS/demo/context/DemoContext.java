package users.java.LifeOS.demo.context;

import lombok.Getter;
import users.java.LifeOS.activity.Activity;
import users.java.LifeOS.friend.Friendship;
import users.java.LifeOS.friend.request.FriendRequest;
import users.java.LifeOS.notification.Notification;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.label.Label;

import java.util.ArrayList;
import java.util.List;

@Getter
public class DemoContext {

    private final List<GeneratedUser> users = new ArrayList<>();

    private final List<Friendship> friendships = new ArrayList<>();

    private final List<FriendRequest> friendRequests = new ArrayList<>();

    private final List<Label> labels = new ArrayList<>();

    private final List<Task> tasks = new ArrayList<>();

    private final List<Activity> activities = new ArrayList<>();

    private final List<Notification> notifications = new ArrayList<>();

}
