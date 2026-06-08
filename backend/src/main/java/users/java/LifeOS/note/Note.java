package users.java.LifeOS.note;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import users.java.LifeOS.task.Task;
import users.java.LifeOS.user.User;

@Setter
@Getter
@Entity
@Table
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;
}
