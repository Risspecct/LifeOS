package users.java.LifeOS.stats;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import users.java.LifeOS.user.User;

import java.time.LocalDate;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "user_stats")
public class UserStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    private Long totalPoints = 0L;
    private Integer currentStreak = 0;
    private Integer longestStreak = 0;
    private Integer tasksCompleted = 0;
    private LocalDate lastActiveDate;

    public UserStats(User user) {
        this.user = user;
    }

    public void addPoints(Long points) {
        totalPoints += points;
    }

    public void incrementTasksCompleted() {
        tasksCompleted++;
    }
}