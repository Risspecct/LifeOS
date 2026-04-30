package users.java.LifeOS.branch;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface BranchMapper {
    Branch toBranch(BranchDto branchDto);
}
