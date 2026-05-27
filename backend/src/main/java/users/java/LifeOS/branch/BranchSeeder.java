package users.java.LifeOS.branch;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(1)
public class BranchSeeder implements CommandLineRunner {

    private final BranchRepository branchRepository;

    public BranchSeeder(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    @Override
    public void run(String... args) {
        List<Branch> branches = List.of(
                new Branch("Computer Science", "CSE"),
                new Branch("Electronics and Communication", "ECE"),
                new Branch("Mechanical", "ME"),
                new Branch("Civil", "CE"),
                new Branch("Computer and Data Science", "CSD"),
                new Branch("Artificial Intelligence and Machine Learning", "AIML")
        );

        branches.forEach(branch -> {
            if (!branchRepository.existsByCode(branch.getCode())) {
                branchRepository.save(branch);
            }
        });
    }
}