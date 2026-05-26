package users.java.LifeOS.activity;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.user.User;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ActivityMapper activityMapper;

    public void logActivity(
            User user,
            ActivityType activityType,
            String title,
            String description,
            Integer points,
            Task task
    ) {

        Activity activity = Activity.builder()
                .user(user)
                .activityType(activityType)
                .title(title)
                .description(description)
                .points(points)
                .task(task)
                .build();

        activityRepository.save(activity);
    }

    public List<ActivityResponse> getRecentActivities(long userId) {

        return activityRepository
                .findTop10ByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(activityMapper::toResponse)
                .toList();
    }

    public void logFriendAdded(User user, User friend) {
        logActivity(
                user,
                ActivityType.FRIEND_ADDED,
                "New Connection",
                "Connected with " + friend.getUsername(),
                ActivityPoints.FRIEND_ADDED,
                null
        );
    }
}