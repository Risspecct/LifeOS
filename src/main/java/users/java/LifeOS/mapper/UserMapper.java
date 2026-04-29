package users.java.LifeOS.mapper;


import org.mapstruct.*;
import users.java.LifeOS.models.User;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    void updateUser(User userUpdate, @MappingTarget User existingUser);
}