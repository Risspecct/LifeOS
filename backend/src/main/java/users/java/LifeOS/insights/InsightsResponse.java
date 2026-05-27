package users.java.LifeOS.insights;

import java.util.List;

public record InsightsResponse(

        ProductivitySummary summary,

        List<HeatmapDayDto> heatmap,

        List<WeeklyTrendDto> weeklyTrend,

        List<FocusDistributionDto> focusDistribution,

        List<ActivityTimelineDto> timeline
) {
}