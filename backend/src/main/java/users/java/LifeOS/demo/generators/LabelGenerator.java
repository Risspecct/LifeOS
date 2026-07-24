package users.java.LifeOS.demo.generators;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import users.java.LifeOS.demo.catalog.LabelCatalog;
import users.java.LifeOS.demo.catalog.LabelDefinition;
import users.java.LifeOS.demo.config.DemoConfiguration;
import users.java.LifeOS.demo.context.DemoContext;
import users.java.LifeOS.demo.context.GeneratedUser;
import users.java.LifeOS.demo.util.DateGenerator;
import users.java.LifeOS.demo.util.RandomData;
import users.java.LifeOS.task.label.Label;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class LabelGenerator {

    private final DemoConfiguration config;
    private final RandomData randomData;
    private final DateGenerator dateGenerator;

    public void generate(DemoContext context) {

        for (GeneratedUser user : context.getUsers()) {
            generateLabelsForUser(user, context);
        }
    }

    private void generateLabelsForUser(
            GeneratedUser user,
            DemoContext context
    ) {

        selectDefinitions().stream()
                .map(definition -> createLabel(definition, user))
                .forEach(context.getLabels()::add);
    }

    private List<LabelDefinition> selectDefinitions() {

        List<LabelDefinition> availableDefinitions = new ArrayList<>(
                LabelCatalog.definitions()
        );

        int labelCount = randomData.between(
                config.getLabelMin(),
                config.getLabelMax()
        );

        List<LabelDefinition> selectedDefinitions = new ArrayList<>();

        while (selectedDefinitions.size() < labelCount
                && !availableDefinitions.isEmpty()) {
            LabelDefinition definition = randomData.oneOf(availableDefinitions);

            selectedDefinitions.add(definition);
            availableDefinitions.remove(definition);
        }

        return selectedDefinitions;
    }

    private Label createLabel(
            LabelDefinition definition,
            GeneratedUser generatedUser
    ) {

        Label label = new Label();

        label.setName(definition.name());
        label.setColor(definition.color());
        label.setPriorityWeight(definition.priorityWeight());
        label.setUser(generatedUser.getUser());

        dateGenerator.applyTimestamps(
                label,
                dateGenerator.randomTimelineDateAfter(
                        generatedUser.getUser().getCreatedAt(),
                        LocalDateTime.now().minusHours(2),
                        30
                )
        );

        return label;
    }
}
