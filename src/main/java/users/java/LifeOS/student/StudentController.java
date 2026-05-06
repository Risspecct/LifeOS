package users.java.LifeOS.student;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import users.java.LifeOS.user.UserService;

@RestController
@RequestMapping("profile")
public class StudentController {
    private final StudentService studentService;
    private final UserService userService;

    StudentController(StudentService studentService, UserService userService) {
        this.studentService = studentService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createProfile(@Valid @RequestBody StudentDto dto) {
        return new ResponseEntity<>(studentService.create(userService.getUserId(), dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<?> myProfile() {
        return ResponseEntity.ok(studentService.getStudentProfile(userService.getUserId()));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable long userId) {
        return ResponseEntity.ok(studentService.getStudentProfile(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllProfiles() {
        return ResponseEntity.ok(studentService.getProfileList());
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@Valid @RequestBody StudentUpdateDto dto) {
        return new ResponseEntity<>(studentService.update(userService.getUserId(), dto), HttpStatus.ACCEPTED);
    }

    @PutMapping("/{branchId}")
    public ResponseEntity<?> updateBranch(@PathVariable long branchId) {
        return new ResponseEntity<>(studentService.updateBranch(userService.getUserId(), branchId), HttpStatus.ACCEPTED);
    }
}