package users.java.LifeOS.branch;

import org.springframework.stereotype.Service;
import users.java.LifeOS.exceptions.NotFoundException;

import java.util.List;

@Service
public class BranchService {
    private final BranchRepository branchRepository;

    BranchService(BranchRepository branchRepository){
        this.branchRepository = branchRepository;
    }

    public Branch create(BranchDto dto){
        Branch branch = new Branch(dto.name(), dto.code());
        return branchRepository.save(branch);
    }

    public List<Branch> getAll() {
        List<Branch> branches = branchRepository.findAll();
        if (branches.isEmpty())
            throw new NotFoundException("No Branches found in database");
        return branches;
    }

    public void delete(long id){
        Branch branch = branchRepository.findById(id).orElseThrow(() -> new NotFoundException("Branch doesn't exist"));
        branchRepository.delete(branch);
    }
}
