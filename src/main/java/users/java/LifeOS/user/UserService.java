package users.java.LifeOS.user;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import users.java.LifeOS.activity.ActivityPoints;
import users.java.LifeOS.activity.ActivityService;
import users.java.LifeOS.activity.ActivityType;
import users.java.LifeOS.auth.dtos.JwtResponseDto;
import users.java.LifeOS.auth.dtos.LoginDto;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.auth.services.JwtService;

import java.util.List;

@AllArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    private final JwtService jwtService;
    private final HttpServletRequest request;
    private final ActivityService activityService;


    public List<UserView> findAll() {
        return userRepository.findALlBy();
    }

    public UserView findById(Long id) {
        return userRepository.findUserById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    public UserView save(UserDto request) {
        User user = userMapper.toEntity(request);
        user.setRole("USER");
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
        return findById(user.getId());
    }

    public UserView update(Long id, UpdateUserDto request) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));

        userMapper.updateUser(request, existingUser);
        userRepository.save(existingUser);
        return findById(id);
    }

    public void delete(long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("No user found"));
        userRepository.delete(user);
    }

    public long getUserId() {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            return jwtService.extractUserId(jwt);
        }
        throw new RuntimeException("Authorization header missing or invalid");
    }

    public JwtResponseDto verify(LoginDto user){
        if (!this.userRepository.existsByEmail(user.email()))
            throw new NotFoundException("User email not found. Register to make a new account");
        Authentication auth = this.authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.email(), user.password()));
        if (auth.isAuthenticated()){

            activityService.logActivity(
                    findByEmail(user.email()),
                    ActivityType.LOGIN,
                    "User Logged in",
                    "User Logged in",
                    ActivityPoints.LOGIN,
                    null
            );

            return JwtResponseDto.builder()
                    .jwt_token(this.jwtService.generateToken(findByEmail(user.email())))
                    .build();
        } else {
            throw new UsernameNotFoundException("Invalid username/email provided");
        }
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("No user found with the provided email"));
    }
}
