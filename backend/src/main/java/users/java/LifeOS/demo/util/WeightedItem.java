package users.java.LifeOS.demo.util;

public record WeightedItem<T>(
        T value,
        int weight
) {
}