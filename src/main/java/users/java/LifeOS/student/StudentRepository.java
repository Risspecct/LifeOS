package users.java.LifeOS.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser_Id(long userId);

    StudentProfileView findStudentById(long id);

    @Query("""
    SELECT new users.java.LifeOS.student.StudentListView(
        s.user.id,
        s.user.username,
        s.college
    )
    FROM Student s
""")
    List<StudentListView> findALlBy();
}
