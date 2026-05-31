package users.java.LifeOS.stats;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
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

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    private Long totalPoints = 0L;

    private Integer currentStreak = 0;
    private Integer longestStreak = 0;

    private Integer tasksCompleted = 0;
    private Integer tasksCreated = 0;

    private LocalDate lastActiveDate;
    private Integer totalDaysActive = 0;

    private Integer friendCount = 0;

    public UserStats(User user) {
        this.user = user;
    }

    public void updateTasksCompletedCount(Integer d) { tasksCompleted = Math.max(0, tasksCompleted + d); }

    public void updateFriendCount(Integer d) { friendCount = Math.max(0, friendCount + 1); }

    public void updateTaskCreatedCount(Integer d) { tasksCreated = Math.max(0, tasksCreated + d); }

    public void updateTotalPoints(Long points) { totalPoints = Math.max(0, totalPoints + points); }
}
