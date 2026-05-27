package users.java.LifeOS.task.label.defaults;

import java.util.List;

public final class DefaultLabels {

    private DefaultLabels() {}

    public static List<DefaultLabelData> getDefaults() {

        return List.of(
                new DefaultLabelData(
                        "Exams",
                        "RED",
                        20
                ),
                new DefaultLabelData(
                        "Assignments",
                        "ORANGE",
                        15
                ),
                new DefaultLabelData(
                        "Placement Prep",
                        "BLUE",
                        18
                ),
                new DefaultLabelData(
                        "Projects",
                        "PURPLE",
                        16
                ),
                new DefaultLabelData(
                        "Learning",
                        "SLATE",
                        8
                ),
                new DefaultLabelData(
                        "Personal",
                        "YELLOW",
                        5
                )
        );
    }
}