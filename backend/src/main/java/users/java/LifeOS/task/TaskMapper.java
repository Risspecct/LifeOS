package users.java.LifeOS.task;

import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TaskMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "label", ignore = true)
    @Mapping(target = "awardedPoints", ignore = true)
    @Mapping(target = "completedAt", ignore = true)
    Task toEntity(TaskDto dto);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "labelName", source = "label.name")
    TaskView toTaskView(Task task);

    @Mapping(target = "labelName", source = "label.name")
    TaskDetailView toTaskDetailView(Task task);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "completedAt", ignore = true)
    @Mapping(target = "label", ignore = true)
    @Mapping(target = "awardedPoints", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Task updateTask(TaskUpdateDto dto, @MappingTarget Task task);

    @Mapping(target = "labelName", source = "label.name")
    TaskListView toTaskListView(Task task);

    List<TaskListView> toTaskListViewList(List<Task> tasks);

        @Mapping(target = "labelName", source = "label.name")
        @Mapping(target = "labelColor", source = "label.color")
        UpcomingTaskDto toDto(Task task);
}
