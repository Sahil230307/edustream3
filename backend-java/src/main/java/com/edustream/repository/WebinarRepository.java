package com.edustream.repository;

import com.edustream.entity.Webinar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WebinarRepository extends JpaRepository<Webinar, Long> {
    List<Webinar> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCategoryContainingIgnoreCase
        (String title, String description, String category);
}
