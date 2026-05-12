package users.java.LifeOS.task;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
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
    @JoinColumn(name = "label_id")
    private Label label;

    @Column
    LocalDateTime dueDate;

    @Column
    LocalDateTime completedAt;
}