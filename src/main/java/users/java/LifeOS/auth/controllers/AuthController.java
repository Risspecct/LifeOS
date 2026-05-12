package users.java.LifeOS.auth.controllers;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import users.java.LifeOS.auth.dtos.LoginDto;
import users.java.LifeOS.user.UserDto;
import users.java.LifeOS.user.UserService;

@AllArgsConstructor
@RestController
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> addUser(@RequestBody @Valid UserDto dto){
        return new ResponseEntity<>(this.userService.save(dto), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginDto loginDto){
        return ResponseEntity.ok(this.userService.verify(loginDto));
    }
}
