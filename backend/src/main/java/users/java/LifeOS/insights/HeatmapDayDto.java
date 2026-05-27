package users.java.LifeOS.insights;

import java.time.LocalDate;

public record HeatmapDayDto(
        LocalDate date,
        Integer score
) {
}