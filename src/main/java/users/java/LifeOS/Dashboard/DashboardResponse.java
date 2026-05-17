package users.java.LifeOS.Dashboard;

import users.java.LifeOS.activity.ActivityResponse;
import users.java.LifeOS.task.UpcomingTaskDto;
import users.java.LifeOS.task.prioritization.PrioritizedTaskResponse;

import java.util.List;

public record DashboardResponse(

        DashboardProfile profile,

        DashboardSummary summary,

        List<PrioritizedTaskResponse> prioritizedTasks,

        List<UpcomingTaskDto> upcomingTasks,

        List<ActivityResponse> recentActivities
) {
}