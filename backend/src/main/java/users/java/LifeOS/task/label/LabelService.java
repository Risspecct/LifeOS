package users.java.LifeOS.task.label;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;
import users.java.LifeOS.exceptions.DuplicateResourceException;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.task.label.defaults.DefaultLabelData;
import users.java.LifeOS.task.label.defaults.DefaultLabels;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LabelService {

    private final LabelRepository labelRepository;
    private final LabelMapper labelMapper;
    private final UserService userService;

    public LabelResponse createLabel(User currentUser, LabelRequest request) {

        if (labelRepository.existsByNameIgnoreCaseAndUser(request.name(),currentUser))
            throw new DuplicateResourceException("Label already exists");

        Label label = labelMapper.toEntity(request);
        label.setUser(currentUser);

        if (label.getPriorityWeight() == null)
            label.setPriorityWeight(0);

        Label savedLabel = labelRepository.save(label);

        return labelMapper.toResponse(savedLabel);
    }

    public void seedDefaultLabels() {

        User currentUser = userService.getAuthenticatedUser();

        List<DefaultLabelData> defaults =
                DefaultLabels.getDefaults();

        for (DefaultLabelData defaultLabel : defaults) {
            boolean exists =
                    labelRepository.existsByNameIgnoreCaseAndUser(defaultLabel.name(), currentUser);
            if (exists) {
                continue;
            }

            Label label = Label.builder()
                    .name(defaultLabel.name())
                    .color(defaultLabel.color())
                    .priorityWeight(defaultLabel.priorityWeight())
                    .user(currentUser)
                    .build();

            labelRepository.save(label);
        }
    }

    public List<LabelResponse> getUserLabels(User currentUser) {

        return labelRepository.findAllByUserOrderByNameAsc(currentUser)
                .stream()
                .map(labelMapper::toResponse)
                .toList();
    }

    public Label getLabelById(long userId, Long labelId) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new NotFoundException("Label not found"));

        verifyAccess(userId, label);
        return label;
    }

    public LabelResponse updateLabel(long userId, long labelId, LabelUpdateRequest request) {
        Label label = getLabelById(userId, labelId);
        labelMapper.updateLabel(request, label);

        labelRepository.save(label);
        return labelMapper.toResponse(label);
    }

    public void deleteLabel(long userId, long labelId) {
        labelRepository.delete(
                getLabelById(userId, labelId)
        );
    }

    public void verifyAccess(long userId, Label label) {
        if (label.getUser().getId() != userId)
            throw new AuthorizationDeniedException("Not allowed to access this resource");
    }
}