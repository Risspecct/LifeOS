package users.java.LifeOS.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import users.java.LifeOS.util.BaseEntity;

@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name="users")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    @NotBlank
    private String email;

    @Column(nullable = true)
    private String password;

    @Column(nullable = false)
    @NotNull
    private String role;
}
