package com.edustream.repository;

import com.edustream.entity.Assignment;
import com.edustream.entity.Webinar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByWebinar(Webinar webinar);
}
