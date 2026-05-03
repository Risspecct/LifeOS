package users.java.LifeOS.student;

import org.springframework.stereotype.Service;
import users.java.LifeOS.branch.Branch;
import users.java.LifeOS.branch.BranchService;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.user.UserService;

import java.util.Optional;

@Service
public class StudentService {
    private final StudentRepository studentRepository;
    private final StudentMapper mapper;
    private final UserService userService;
    private final BranchService branchService;

    StudentService(StudentRepository studentRepository, StudentMapper studentMapper,
                   UserService userService, BranchService branchService) {
        this.mapper = studentMapper;
        this.studentRepository = studentRepository;
        this.userService = userService;
        this.branchService = branchService;
    }

    public StudentProfileView create(long userId, StudentDto dto) {
        Optional<Student> existing = studentRepository.findByUser_Id(userId);

        if (existing.isPresent()) {
            throw new IllegalStateException("Profile already exists");
        }

        Student student = mapper.toStudent(dto);
        student.setBranch(branchService.getById(dto.branchId()));
        student.setUser(userService.getById(userId));

        studentRepository.save(student);

        return getStudentProfile(userId);
    }

    public StudentProfileView update(long userId, StudentUpdateDto dto) {
        Student student = studentRepository.findByUser_Id(userId)
                .orElseThrow(() -> new NotFoundException("No Student profile found associated with this user"));
        mapper.updateStudent(dto, student);
        studentRepository.save(student);

        return getStudentProfile(userId);
    }

    public StudentProfileView updateBranch(long userId, long branchId) {
        Student student = studentRepository.findByUser_Id(userId)
                .orElseThrow(() -> new NotFoundException("No Student profile found associated with this user"));
        Branch branch = branchService.getById(branchId);

        student.setBranch(branch);
        studentRepository.save(student);
        return getStudentProfile(userId);
    }

    public StudentProfileView getStudentProfile(long userId) {
        Student student = studentRepository.findByUser_Id(userId)
                .orElseThrow(() -> new NotFoundException("No Student profile found associated with this user"));

        return mapper.toProfileView(student);
    }
}
