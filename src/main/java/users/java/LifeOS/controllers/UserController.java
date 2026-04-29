package users.java.LifeOS.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import users.java.LifeOS.dtos.UpdateUserDto;
import users.java.LifeOS.dtos.UserDto;
import users.java.LifeOS.models.User;
import users.java.LifeOS.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(){
        return ResponseEntity.ok(userService.findById(userService.getUserId()));
    }

    @PutMapping()
    public ResponseEntity<?> updateUser(@Valid @RequestBody UpdateUserDto request) {
        return ResponseEntity.ok(userService.update(userService.getUserId(), request));
    }

    @DeleteMapping()
    public ResponseEntity<?> deleteUser() {
        userService.delete(userService.getUserId());
        return ResponseEntity.ok("User deleted successfully");
    }
}