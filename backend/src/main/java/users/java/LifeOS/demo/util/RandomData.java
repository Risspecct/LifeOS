package users.java.LifeOS.demo.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import users.java.LifeOS.demo.config.DemoConfiguration;

import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class RandomData {

    private final DemoConfiguration configuration;

    private Random random;

    private Random random() {

        if (random == null) {
            random = new Random(configuration.getRandomSeed());
        }

        return random;
    }

    public boolean chance(double probability) {
        return random().nextDouble() < probability;
    }

    public int between(int min, int max) {
        return random().nextInt(max - min + 1) + min;
    }

    public <T> T oneOf(List<T> values) {
        return values.get(
                random().nextInt(values.size())
        );
    }

    public <T> T weighted(List<WeightedItem<T>> items) {
        int totalWeight = items.stream()
                .mapToInt(WeightedItem::weight)
                .sum();

        int randomValue = between(1, totalWeight);
        int cumulative = 0;
        for (WeightedItem<T> item : items) {

            cumulative += item.weight();

            if (randomValue <= cumulative) {
                return item.value();
            }
        }
        throw new IllegalStateException("Unable to select weighted value.");
    }
}