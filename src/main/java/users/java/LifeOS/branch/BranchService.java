package users.java.LifeOS.branch;

import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import users.java.LifeOS.exceptions.DuplicateResourceException;
import users.java.LifeOS.exceptions.NotFoundException;

@Slf4j
@Service
public class BranchService {
    private final BranchRepository branchRepository;

    BranchService(BranchRepository branchRepository){
        this.branchRepository = branchRepository;
    }

    public Branch create(BranchDto dto){
        if (branchRepository.existsByNameIgnoreCase(dto.name()) || branchRepository.existsByCodeIgnoreCase(dto.code()))
            throw new DuplicateResourceException("Branch already exists!");
        Branch branch = new Branch(dto.name(), dto.code());

        log.info("Nww branch created with code: {}", branch.getCode());
        return branchRepository.save(branch);
    }

    public List<Branch> getAll() {
        List<Branch> branches = branchRepository.findAll();
        if (branches.isEmpty())
            throw new NotFoundException("No Branches found in database");
        return branches;
    }

    public Branch getById(long id) {
        return branchRepository.findById(id).orElseThrow(() -> new NotFoundException("Branch Not Found"));
    }

    public void delete(long id){
        Branch branch = branchRepository.findById(id).orElseThrow(() -> new NotFoundException("Branch doesn't exist"));
        branchRepository.delete(branch);

        log.info("Branch with code: {} deleted", branch.getCode());
    }
}
