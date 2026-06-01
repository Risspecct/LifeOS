package users.java.LifeOS.task.label;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import users.java.LifeOS.user.UserService;

@RestController
@RequestMapping("/labels")
@RequiredArgsConstructor
public class LabelController {

    private final LabelService labelService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createLabel(@Valid @RequestBody LabelRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(labelService.createLabel(userService.getAuthenticatedUser(), request));
    }

    @GetMapping
    public ResponseEntity<?> getUserLabels() {
        return ResponseEntity.ok(labelService.getUserLabels(userService.getAuthenticatedUser()));
    }

    @PutMapping("/{labelId}")
    public ResponseEntity<?> updateLabel(@PathVariable Long labelId, @RequestBody LabelUpdateRequest request) {
        return ResponseEntity.ok(labelService.updateLabel(userService.getUserId(), labelId, request));
    }

    @DeleteMapping("/{labelId}")
    public ResponseEntity<?> deleteLabel(@PathVariable Long labelId) {
        labelService.deleteLabel(userService.getUserId(), labelId);
        return ResponseEntity.ok("Label deleted successfully!");
    }

    @PostMapping("/defaults")
    public ResponseEntity<String> seedDefaultLabels() {
        labelService.seedDefaultLabels();
        return ResponseEntity.ok(
                "Default labels added successfully"
        );
    }
}