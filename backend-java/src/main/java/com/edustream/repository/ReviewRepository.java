package com.edustream.repository;

import com.edustream.entity.Review;
import com.edustream.entity.Webinar;
import com.edustream.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByWebinar(Webinar webinar);
    Optional<Review> findByWebinarAndUser(Webinar webinar, User user);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.webinar.id = ?1")
    Double getAverageRating(Long webinarId);
}
