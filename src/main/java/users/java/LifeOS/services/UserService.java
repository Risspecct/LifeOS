package users.java.LifeOS.services;

import org.springframework.stereotype.Service;
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

    UserService(UserRepository userRepository, UserMapper userMapper){
        this.userRepository = userRepository;
        this.userMapper = userMapper;
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
}
