package users.java.LifeOS.branch;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
    Boolean existsByNameIgnoreCase(String name);
    Boolean existsByCodeIgnoreCase(String code);
    Boolean existsByCode(String code);
}
