package users.java.LifeOS.task.label;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import users.java.LifeOS.user.User;
import users.java.LifeOS.util.BaseEntity;

@Entity
@Table(name = "labels")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Label extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String color;

    @Column(nullable = false)
    private Integer priorityWeight = 0;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;
}