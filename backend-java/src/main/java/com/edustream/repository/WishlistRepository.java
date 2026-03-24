package com.edustream.repository;

import com.edustream.entity.Wishlist;
import com.edustream.entity.User;
import com.edustream.entity.Webinar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser(User user);
    Optional<Wishlist> findByUserAndWebinar(User user, Webinar webinar);
    boolean existsByUserAndWebinar(User user, Webinar webinar);
    void deleteByUserAndWebinar(User user, Webinar webinar);
}
