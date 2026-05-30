package users.java.LifeOS.task;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import users.java.LifeOS.task.label.Label;
import users.java.LifeOS.user.User;
import users.java.LifeOS.util.BaseEntity;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "task")
public class Task extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    User user;

    @Column
    @NotBlank
    String title;

    @Column
    String description;

    @Enumerated(EnumType.STRING)
    @Column
    Status status;

    @Column
    String taskType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "label_id", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Label label;

    @Column
    LocalDateTime dueDate;

    @Column
    LocalDateTime completedAt;

    @Enumerated(EnumType.STRING)
    TaskPriority manualPriority;
}