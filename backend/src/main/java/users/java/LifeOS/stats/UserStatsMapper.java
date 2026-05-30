package users.java.LifeOS.stats;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserStatsMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateUserStats(UserStatsBuildDto dto, @MappingTarget UserStats userStats);
}
