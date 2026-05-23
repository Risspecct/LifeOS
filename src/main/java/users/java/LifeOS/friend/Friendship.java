package users.java.LifeOS.friend;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import users.java.LifeOS.user.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "friendships", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_one_id","user_two_id"})})
@Getter
@Setter
@NoArgsConstructor
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_one_id", nullable = false)
    private User userOne;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_two_id", nullable = false)
    private User userTwo;

    @Column(nullable = false)
    private LocalDateTime createdAt =
            LocalDateTime.now();

    public Friendship(User userOne, User userTwo) {
        this.userOne = userOne;
        this.userTwo = userTwo;
    }
}