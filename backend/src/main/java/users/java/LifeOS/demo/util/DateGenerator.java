package users.java.LifeOS.demo.util;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DateGenerator {

    private final RandomData random;

    public DateGenerator(RandomData random) {
        this.random = random;
    }

    public LocalDateTime randomPastDays(int days) {
        return LocalDateTime.now()
                .minusDays(random.between(0, days))
                .minusHours(random.between(0, 23))
                .minusMinutes(random.between(0, 59));
    }

    public LocalDateTime randomFutureDays(int days) {
        return LocalDateTime.now()
                .plusDays(random.between(0, days))
                .plusHours(random.between(0, 23))
                .plusMinutes(random.between(0, 59));
    }
}