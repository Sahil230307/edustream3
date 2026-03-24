package com.edustream.service;

import com.edustream.dto.AssignmentDTO;
import com.edustream.entity.Assignment;
import com.edustream.entity.Webinar;
import com.edustream.repository.AssignmentRepository;
import com.edustream.repository.WebinarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentService {
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private WebinarRepository webinarRepository;
    
    public AssignmentDTO createAssignment(Long webinarId, AssignmentDTO dto) {
        Webinar webinar = webinarRepository.findById(webinarId)
            .orElseThrow(() -> new RuntimeException("Webinar not found"));
        
        Assignment assignment = new Assignment();
        assignment.setWebinar(webinar);
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDueDate(dto.getDueDate());
        
        Assignment saved = assignmentRepository.save(assignment);
        return AssignmentDTO.from(saved);
    }
    
    public List<AssignmentDTO> getAssignmentsByWebinar(Long webinarId) {
        Webinar webinar = webinarRepository.findById(webinarId)
            .orElseThrow(() -> new RuntimeException("Webinar not found"));
        
        return assignmentRepository.findByWebinar(webinar).stream()
            .map(AssignmentDTO::from)
            .collect(Collectors.toList());
    }
    
    public AssignmentDTO updateAssignment(Long id, AssignmentDTO dto) {
        Assignment assignment = assignmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDueDate(dto.getDueDate());
        
        Assignment updated = assignmentRepository.save(assignment);
        return AssignmentDTO.from(updated);
    }
    
    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }
}
