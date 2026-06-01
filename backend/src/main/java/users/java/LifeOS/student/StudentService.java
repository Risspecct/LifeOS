package users.java.LifeOS.student;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import users.java.LifeOS.activity.ActivityPoints;
import users.java.LifeOS.activity.ActivityService;
import users.java.LifeOS.activity.ActivityType;
import users.java.LifeOS.branch.Branch;
import users.java.LifeOS.branch.BranchService;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.friend.RelationshipInfo;
import users.java.LifeOS.friend.RelationshipService;
import users.java.LifeOS.stats.StatsService;
import users.java.LifeOS.stats.UserStats;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserService;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Slf4j
@Service
public class StudentService {
    private final StudentRepository studentRepository;
    private final StudentMapper mapper;
    private final UserService userService;
    private final BranchService branchService;
    private final ActivityService activityService;
    private final StatsService statsService;
    private final RelationshipService relationshipService;

    public StudentProfileView create(long userId, StudentDto dto) {
        Optional<Student> existing = studentRepository.findByUser_Id(userId);

        if (existing.isPresent()) {
            throw new IllegalStateException("Profile already exists");
        }

        Student student = mapper.toStudent(dto);
        student.setBranch(branchService.getById(dto.branchId()));
        student.setUser(userService.getById(userId));

        studentRepository.save(student);

        log.info("User profile created for user id: {}", userId);
        return getCurrentUserProfile();
    }

    public StudentProfileView update(long userId, StudentUpdateDto dto) {
        Student student = studentRepository.findByUser_Id(userId)
                .orElseThrow(() -> new NotFoundException("No Student profile found associated with this user"));
        mapper.updateStudent(dto, student);
        studentRepository.save(student);

        activityService.logActivity(student.getUser(),
                ActivityType.PROFILE_UPDATED,
                "Profile",
                "User Profile updated",
                ActivityPoints.PROFILE_UPDATED,
                null);

        return getCurrentUserProfile();
    }

    public StudentProfileView updateBranch(long userId, long branchId) {
        Student student = studentRepository.findByUser_Id(userId)
                .orElseThrow(() -> new NotFoundException("No Student profile found associated with this user"));
        Branch branch = branchService.getById(branchId);

        student.setBranch(branch);
        studentRepository.save(student);
        return getCurrentUserProfile();
    }

    public StudentProfileView getCurrentUserProfile() {
        Student student = getStudent(userService.getUserId());
        return mapper.toProfileView(student);
    }

    public PublicStudentProfileView getPublicProfile(Long userId) {
        Student student = getStudent(userId);
        UserStats stats = statsService.getStats(student.getUser());
        RelationshipInfo relInfo = relationshipService.getRelationship(
                userService.getAuthenticatedUser(),
                student.getUser());

        return new PublicStudentProfileView(
                userId,
                student.getUser().getUsername(),

                student.getName(),
                student.getCollege(),
                student.getYear(),
                student.getBranch().getCode(),
                student.getBio(),

                stats.getTotalPoints(),
                stats.getCurrentStreak(),
                stats.getLongestStreak(),
                stats.getTasksCompleted(),
                stats.getFriendCount(),

                relInfo.status(),
                relInfo.requestId()
        );
    }

    public Student getStudent(long userId) {
        return studentRepository.findByUser_Id(userId)
                .orElseThrow(() -> new NotFoundException("No Student profile found associated with this user"));
    }

    public List<User> getUsersByCollege(String college) {
        return studentRepository
                .findByCollegeIgnoreCase(college)
                .stream()
                .map(Student::getUser)
                .toList();
    }

    public List<StudentDiscoveryDto>
    searchUsers(String query) {
        return studentRepository.searchUsers(query, userService.getUserId());
    }

    public List<StudentListView> getProfileList() {
        return studentRepository.findALlBy(userService.getUserId());
    }
}
