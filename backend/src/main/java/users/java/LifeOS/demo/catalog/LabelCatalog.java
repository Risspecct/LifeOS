package users.java.LifeOS.demo.catalog;

import java.util.List;

public final class LabelCatalog {

    private static final List<LabelDefinition> DEFINITIONS = List.of(
            new LabelDefinition("Study", "#2563EB", 7),
            new LabelDefinition("Assignments", "#F97316", 8),
            new LabelDefinition("Projects", "#7C3AED", 8),
            new LabelDefinition("Exams", "#DC2626", 10),
            new LabelDefinition("Internship", "#0EA5E9", 7),
            new LabelDefinition("Career", "#EA580C", 7),
            new LabelDefinition("Reading", "#4F46E5", 3),
            new LabelDefinition("Coding", "#0891B2", 7),
            new LabelDefinition("Health", "#0D9488", 5),
            new LabelDefinition("Gym", "#16A34A", 5),
            new LabelDefinition("Personal", "#6B7280", 2),
            new LabelDefinition("Shopping", "#DB2777", 2),
            new LabelDefinition("Finance", "#65A30D", 5),
            new LabelDefinition("Meetings", "#475569", 4),
            new LabelDefinition("Research", "#9333EA", 6),
            new LabelDefinition("Urgent", "#B91C1C", 10)
    );

    private LabelCatalog() {
    }

    public static List<LabelDefinition> definitions() {
        return DEFINITIONS;
    }
}
