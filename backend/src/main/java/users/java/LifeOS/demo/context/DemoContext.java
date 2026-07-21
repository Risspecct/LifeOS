package users.java.LifeOS.demo.context;

import lombok.Getter;
import users.java.LifeOS.activity.Activity;
import users.java.LifeOS.branch.Branch;
import users.java.LifeOS.friend.Friendship;
import users.java.LifeOS.note.Note;
import users.java.LifeOS.notification.Notification;
import users.java.LifeOS.stats.UserStats;
import users.java.LifeOS.student.Student;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.task.label.Label;
import users.java.LifeOS.user.User;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class DemoContext {

    private final List<GeneratedUser> generatedUsers = new ArrayList<>();

    private final List<Branch> branches = new ArrayList<>();

    private final List<Label> labels = new ArrayList<>();

    private final List<Task> tasks = new ArrayList<>();

    private final List<Activity> activities = new ArrayList<>();

    private final List<Notification> notifications = new ArrayList<>();

    private final List<Friendship> friendships = new ArrayList<>();

    private final List<Note> notes = new ArrayList<>();

    public List<User> getUsers() {
        return generatedUsers.stream()
                .map(GeneratedUser::getUser)
                .collect(Collectors.toList());
    }

    public List<Student> getStudents() {
        return generatedUsers.stream()
                .map(GeneratedUser::getStudent)
                .collect(Collectors.toList());
    }

    public List<UserStats> getUserStats() {
        return generatedUsers.stream()
                .map(GeneratedUser::getStats)
                .collect(Collectors.toList());
    }

}