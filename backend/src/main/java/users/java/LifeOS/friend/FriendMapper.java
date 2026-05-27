package users.java.LifeOS.friend;

import org.mapstruct.Mapper;
import users.java.LifeOS.user.User;

@Mapper(componentModel = "spring")
public interface FriendMapper {
    FriendDto toDto(User user);
}