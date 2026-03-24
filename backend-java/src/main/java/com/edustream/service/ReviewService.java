package com.edustream.service;

import com.edustream.dto.ReviewDTO;
import com.edustream.entity.Review;
import com.edustream.entity.User;
import com.edustream.entity.Webinar;
import com.edustream.repository.ReviewRepository;
import com.edustream.repository.UserRepository;
import com.edustream.repository.WebinarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WebinarRepository webinarRepository;
    
    public ReviewDTO addReview(String email, ReviewDTO dto) {
        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Webinar webinar = webinarRepository.findById(dto.getWebinarId())
            .orElseThrow(() -> new RuntimeException("Webinar not found"));
        
        if (reviewRepository.findByWebinarAndUser(webinar, user).isPresent()) {
            throw new RuntimeException("You have already reviewed this webinar");
        }
        
        Review review = new Review();
        review.setWebinar(webinar);
        review.setUser(user);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        
        Review saved = reviewRepository.save(review);
        return ReviewDTO.from(saved);
    }
    
    public List<ReviewDTO> getReviewsByWebinar(Long webinarId) {
        Webinar webinar = webinarRepository.findById(webinarId)
            .orElseThrow(() -> new RuntimeException("Webinar not found"));
        
        return reviewRepository.findByWebinar(webinar).stream()
            .map(ReviewDTO::from)
            .collect(Collectors.toList());
    }
    
    public ReviewDTO updateReview(Long id, ReviewDTO dto, String email) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!review.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        
        Review updated = reviewRepository.save(review);
        return ReviewDTO.from(updated);
    }
    
    public void deleteReview(Long id, String email) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!review.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        
        reviewRepository.deleteById(id);
    }
}
