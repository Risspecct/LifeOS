package users.java.LifeOS.activity;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ActivityMapper {

    @Mapping(target = "taskId", source = "task.id")
    @Mapping(target = "taskTitle", source = "task.title")
    @Mapping(target = "createdAt", source = "createdAt")
    ActivityResponse toResponse(Activity activity);
}