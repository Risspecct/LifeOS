package users.java.LifeOS.branch;

import org.springframework.stereotype.Service;
import users.java.LifeOS.exceptions.NotFoundException;

import java.util.List;

@Service
public class BranchService {
    private final BranchRepository branchRepository;
    private final BranchMapper mapper;

    BranchService(BranchRepository branchRepository, BranchMapper branchMapper){
        this.branchRepository = branchRepository;
        mapper = branchMapper;
    }

    public Branch create(BranchDto dto){
        Branch branch = mapper.toBranch(dto);
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
