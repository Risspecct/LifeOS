package users.java.LifeOS.task;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TaskMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Task toEntity(TaskDto dto);

    @Mapping(target = "userId", source = "user.id")
    TaskView toTaskView(Task task);

    TaskDetailView toTaskDetailView(Task task);
}
