package com.edustream.dto;

import com.edustream.entity.Submission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDTO {
    private Long id;
    private Long assignmentId;
    private Long userId;
    private String content;
    private LocalDateTime submittedAt;
    private BigDecimal grade;
    private String feedback;
    private LocalDateTime gradedAt;
    
    public static SubmissionDTO from(Submission submission) {
        return SubmissionDTO.builder()
            .id(submission.getId())
            .assignmentId(submission.getAssignment().getId())
            .userId(submission.getUser().getId())
            .content(submission.getContent())
            .submittedAt(submission.getSubmittedAt())
            .grade(submission.getGrade())
            .feedback(submission.getFeedback())
            .gradedAt(submission.getGradedAt())
            .build();
    }
}
