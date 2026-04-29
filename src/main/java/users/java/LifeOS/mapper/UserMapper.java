package users.java.LifeOS.mapper;


import org.mapstruct.*;
import users.java.LifeOS.dtos.UpdateUserDto;
import users.java.LifeOS.dtos.UserDto;
import users.java.LifeOS.models.User;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {

    User toEntity(UserDto request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    void updateUser(UpdateUserDto userDto, @MappingTarget User existingUser);
}