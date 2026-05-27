package users.java.LifeOS.task.prioritization;
import java.util.List;

public record PriorityResult(

        Integer score,
        SmartPriorityLevel level,
        List<String> reasons
) {
}