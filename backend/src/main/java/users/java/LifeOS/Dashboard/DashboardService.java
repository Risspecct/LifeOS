package users.java.LifeOS.Dashboard;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import users.java.LifeOS.activity.ActivityResponse;
import users.java.LifeOS.activity.ActivityService;
import users.java.LifeOS.stats.StatsService;
import users.java.LifeOS.student.StudentProfileView;
import users.java.LifeOS.student.StudentService;
import users.java.LifeOS.task.TaskService;
import users.java.LifeOS.task.TaskStats;
import users.java.LifeOS.task.UpcomingTaskDto;
import users.java.LifeOS.task.prioritization.PrioritizationService;
import users.java.LifeOS.task.prioritization.PrioritizedTaskResponse;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserService userService;
    private final TaskService taskService;
    private final ActivityService activityService;
    private final PrioritizationService prioritizationService;
    private final StudentService studentService;
    private final StatsService statsService;

    public DashboardResponse getDashboardData() {
        User currentUser = userService.getAuthenticatedUser();
        TaskStats taskStats = taskService.getTaskStats(currentUser);
        Integer currentStreak = statsService.getCurrentStreak(currentUser);

        DashboardSummary summary = new DashboardSummary(
                        taskStats.totalTasks(),
                        taskStats.completedTasks(),
                        taskStats.pendingTasks(),
                        taskStats.overdueTasks(),
                        currentStreak
                );


        List<PrioritizedTaskResponse> prioritizedTasks =
                prioritizationService
                        .getPrioritizedTasks()
                        .stream()
                        .limit(5)
                        .toList();


        List<UpcomingTaskDto> upcomingTasks =
                taskService.getUpcomingTasks(currentUser.getId());


        List<ActivityResponse> recentActivities =
                activityService
                        .getRecentActivities(currentUser.getId());

        StudentProfileView profile =
                studentService.getStudentProfile(currentUser.getId());

        DashboardProfile dashboardProfile =
                new DashboardProfile(
                        profile.name(),
                        currentUser.getUsername(),
                        currentUser.getEmail(),
                        profile.branchCode(),
                        profile.year()
                );

        return new DashboardResponse(
                dashboardProfile,
                summary,
                prioritizedTasks,
                upcomingTasks,
                recentActivities
        );
    }
}