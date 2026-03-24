package com.edustream.dto;

import com.edustream.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private Long webinarId;
    private Long userId;
    private String userName;
    private Integer rating;
    private String comment;
    
    public static ReviewDTO from(Review review) {
        return ReviewDTO.builder()
            .id(review.getId())
            .webinarId(review.getWebinar().getId())
            .userId(review.getUser().getId())
            .userName(review.getUser().getName())
            .rating(review.getRating())
            .comment(review.getComment())
            .build();
    }
}
