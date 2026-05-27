package users.java.LifeOS.task.label;

import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface LabelMapper {

    LabelResponse toResponse(Label label);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Label toEntity(LabelRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateLabel(LabelUpdateRequest request, @MappingTarget Label label);
}