package users.java.LifeOS.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import users.java.LifeOS.dtos.LoginDto;
import users.java.LifeOS.dtos.UpdateUserDto;
import users.java.LifeOS.dtos.UserDto;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.mapper.UserMapper;
import users.java.LifeOS.models.User;
import users.java.LifeOS.repositories.UserRepository;
import users.java.LifeOS.views.UserView;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    UserService(UserRepository userRepository, UserMapper userMapper, AuthenticationManager authenticationManager){
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.authenticationManager = authenticationManager;
    }

    public List<UserView> findAll() {
        return userRepository.findALlBy();
    }

    public UserView findById(Long id) {
        return userRepository.findUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserView save(UserDto request) {
        User user = userMapper.toEntity(request);
        user.setRole("USER");
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
        System.out.println(user.getPassword());
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

    public String verify(LoginDto user){
        if (!this.userRepository.existsByEmail(user.email()))
            throw new NotFoundException("User email not found. Register to make a new account");
        Authentication auth = this.authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.email(), user.password()));
        if (auth.isAuthenticated()){
            return "Authentication Successful";
        }
        return "Authentication failed";
    }
}
