package users.java.LifeOS.task;

import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TaskMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Task toEntity(TaskDto dto);

    @Mapping(target = "userId", source = "user.id")
    TaskView toTaskView(Task task);

    TaskDetailView toTaskDetailView(Task task);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "completedAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Task updateTask(TaskUpdateDto dto, @MappingTarget Task task);

    TaskListView toTaskListView(Task task);

    List<TaskListView> toTaskListViewList(List<Task> tasks);
}
