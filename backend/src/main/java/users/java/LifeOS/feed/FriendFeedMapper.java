package users.java.LifeOS.feed;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import users.java.LifeOS.activity.Activity;

@Mapper(componentModel = "spring")
public interface FriendFeedMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "username", source = "user.username")
    FriendActivityResponse toResponse(Activity activity);
}