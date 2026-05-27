package users.java.LifeOS.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import users.java.LifeOS.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser_Id(long userId);

    @Query("""
    SELECT new users.java.LifeOS.student.StudentListView(
        s.user.id,
        s.user.username,
        s.college
    )
    FROM Student s
    WHERE s.user.id != :currentUserId
    AND NOT EXISTS (
        SELECT fr.id
        FROM FriendRequest fr
        WHERE (
            (fr.sender.id = :currentUserId AND fr.receiver.id = s.user.id)
            OR
            (fr.receiver.id = :currentUserId AND fr.sender.id = s.user.id)
        )
        AND fr.status IN ('PENDING', 'ACCEPTED')
    )
    """)
    List<StudentListView> findALlBy(@Param("currentUserId") Long currentUserId);

    List<Student> findByCollegeIgnoreCase(String College);

    @Query("""
    SELECT new users.java.LifeOS.student.StudentDiscoveryDto(
        u.id,
        u.username,
        s.college
    )
    FROM Student s
    JOIN s.user u
    WHERE
        u.id != :currentUserId
        AND
        (
            LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))
            OR
            LOWER(s.college) LIKE LOWER(CONCAT('%', :query, '%'))
        )
    """)
    List<StudentDiscoveryDto> searchUsers(@Param("query") String query, @Param("currentUserId") Long currentUserId);
}
