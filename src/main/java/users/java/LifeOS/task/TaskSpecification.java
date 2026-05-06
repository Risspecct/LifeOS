package users.java.LifeOS.task;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class TaskSpecification {

    public static Specification<Task> filterTasks(
            Long userId,
            Status status,
            String label,
            String taskType
    ) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            predicates.add(
                    cb.equal(root.get("user").get("id"), userId)
            );
            
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (label != null && !label.isBlank()) {
                predicates.add(cb.equal(root.get("label"), label));
            }

            if (taskType != null && !taskType.isBlank()) {
                predicates.add(cb.equal(root.get("taskType"), taskType));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}