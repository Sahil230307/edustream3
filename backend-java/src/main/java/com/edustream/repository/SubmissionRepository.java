package com.edustream.repository;

import com.edustream.entity.Submission;
import com.edustream.entity.Assignment;
import com.edustream.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByAssignment(Assignment assignment);
    List<Submission> findByUser(User user);
}
