package users.java.LifeOS.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
    private long id;

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
