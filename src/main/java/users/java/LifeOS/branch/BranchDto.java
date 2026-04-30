package users.java.LifeOS.branch;

import jakarta.validation.constraints.NotBlank;

public record BranchDto(
   @NotBlank
   String name,

   @NotBlank
   String code
) {}
