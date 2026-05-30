package users.java.LifeOS.student;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import users.java.LifeOS.branch.Branch;
import users.java.LifeOS.user.User;
import users.java.LifeOS.util.BaseEntity;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "student")
public class Student extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Column
    @NotBlank
    private String name;

    @Column
    @Min(15)
    @Max(100)
    private Integer age;

    @Column
    private String college;

    @Column
    @Min(1)
    @Max(4)
    private Integer year;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Branch branch;

    @Column
    private String bio;
}
