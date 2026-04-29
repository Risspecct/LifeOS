package users.java.LifeOS.security;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import users.java.LifeOS.dtos.LoginDto;
import users.java.LifeOS.dtos.UserDto;
import users.java.LifeOS.services.UserService;

@RestController
public class AuthController {
    private final UserService userService;

    AuthController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> addUser(@RequestBody @Valid UserDto dto){
        return new ResponseEntity<>(this.userService.save(dto), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginDto loginDto){
        return ResponseEntity.ok(this.userService.verify(loginDto));
    }
}
