package users.java.LifeOS.note;

import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NoteMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "task", ignore = true)
    @Mapping(target = "user", ignore = true)
    Note toEntity(NoteCreateDto dto);

    @Mapping(target = "taskId", source = "task.id")
    NoteView toNoteView(Note note);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "task", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Note updateNote(NoteUpdateDto dto, @MappingTarget Note note);

    @Mapping(target = "taskId", source = "task.id")
    NoteListView toNoteListView(Note note);

    List<NoteListView> toNoteListViewList(List<Note> notes);
}
