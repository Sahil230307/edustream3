package com.edustream.dto;

import com.edustream.entity.Assignment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentDTO {
    private Long id;
    private Long webinarId;
    private String title;
    private String description;
    private LocalDate dueDate;
    
    public static AssignmentDTO from(Assignment assignment) {
        return AssignmentDTO.builder()
            .id(assignment.getId())
            .webinarId(assignment.getWebinar().getId())
            .title(assignment.getTitle())
            .description(assignment.getDescription())
            .dueDate(assignment.getDueDate())
            .build();
    }
}
