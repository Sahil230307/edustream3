package com.edustream.service;

import com.edustream.dto.SubmissionDTO;
import com.edustream.entity.Assignment;
import com.edustream.entity.Submission;
import com.edustream.entity.User;
import com.edustream.repository.AssignmentRepository;
import com.edustream.repository.SubmissionRepository;
import com.edustream.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubmissionService {
    
    @Autowired
    private SubmissionRepository submissionRepository;
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public SubmissionDTO submitAssignment(String email, SubmissionDTO dto) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Assignment assignment = assignmentRepository.findById(dto.getAssignmentId())
            .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        Submission submission = new Submission();
        submission.setAssignment(assignment);
        submission.setUser(user);
        submission.setContent(dto.getContent());
        
        Submission saved = submissionRepository.save(submission);
        return SubmissionDTO.from(saved);
    }
    
    public List<SubmissionDTO> getMySubmissions(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return submissionRepository.findByUser(user).stream()
            .map(SubmissionDTO::from)
            .collect(Collectors.toList());
    }
    
    public List<SubmissionDTO> getSubmissionsByAssignment(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        return submissionRepository.findByAssignment(assignment).stream()
            .map(SubmissionDTO::from)
            .collect(Collectors.toList());
    }
    
    public SubmissionDTO gradeSubmission(Long id, SubmissionDTO dto) {
        Submission submission = submissionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Submission not found"));
        
        submission.setGrade(dto.getGrade());
        submission.setFeedback(dto.getFeedback());
        submission.setGradedAt(LocalDateTime.now());
        
        Submission updated = submissionRepository.save(submission);
        return SubmissionDTO.from(updated);
    }
}
