package com.edustream.repository;

import com.edustream.entity.Registration;
import com.edustream.entity.User;
import com.edustream.entity.Webinar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByUser(User user);
    List<Registration> findByWebinar(Webinar webinar);
    Optional<Registration> findByUserAndWebinar(User user, Webinar webinar);
    boolean existsByUserAndWebinar(User user, Webinar webinar);
}
