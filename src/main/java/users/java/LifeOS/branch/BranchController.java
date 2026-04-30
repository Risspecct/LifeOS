package users.java.LifeOS.branch;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/branch")
public class BranchController {
    private final BranchService branchService;

    BranchController(BranchService branchService){
        this.branchService = branchService;
    }

    @PostMapping("/")
    public ResponseEntity<?> create(@RequestBody @Valid BranchDto dto) {
        return new ResponseEntity<>(branchService.create(dto), HttpStatus.CREATED);
    }

    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(branchService.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        branchService.delete(id);
        return new ResponseEntity<>("Branch deleted successfully", HttpStatus.OK);
    }
}
