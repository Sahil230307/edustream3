package com.edustream.service;

import com.edustream.dto.WebinarDTO;
import com.edustream.entity.Webinar;
import com.edustream.repository.WebinarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WebinarService {
    
    @Autowired
    private WebinarRepository webinarRepository;
    
    public List<WebinarDTO> getAllWebinars() {
        return webinarRepository.findAll().stream()
            .map(WebinarDTO::from)
            .collect(Collectors.toList());
    }
    
    public WebinarDTO getWebinarById(Long id) {
        Webinar webinar = webinarRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Webinar not found"));
        return WebinarDTO.from(webinar);
    }
    
    public WebinarDTO createWebinar(WebinarDTO dto) {
        Webinar webinar = new Webinar();
        webinar.setTitle(dto.getTitle());
        webinar.setSpeaker(dto.getSpeaker());
        webinar.setSpeakerEmail(dto.getSpeakerEmail());
        webinar.setDate(dto.getDate());
        webinar.setTime(dto.getTime());
        webinar.setDescription(dto.getDescription());
        webinar.setCategory(dto.getCategory());
        webinar.setDifficulty(dto.getDifficulty());
        webinar.setMaxCapacity(dto.getMaxCapacity());
        webinar.setImageUrl(dto.getImageUrl());
        webinar.setRecordingUrl(dto.getRecordingUrl());
        
        Webinar saved = webinarRepository.save(webinar);
        return WebinarDTO.from(saved);
    }
    
    public WebinarDTO updateWebinar(Long id, WebinarDTO dto) {
        Webinar webinar = webinarRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Webinar not found"));
        
        webinar.setTitle(dto.getTitle());
        webinar.setSpeaker(dto.getSpeaker());
        webinar.setSpeakerEmail(dto.getSpeakerEmail());
        webinar.setDate(dto.getDate());
        webinar.setTime(dto.getTime());
        webinar.setDescription(dto.getDescription());
        webinar.setCategory(dto.getCategory());
        webinar.setDifficulty(dto.getDifficulty());
        webinar.setMaxCapacity(dto.getMaxCapacity());
        webinar.setImageUrl(dto.getImageUrl());
        webinar.setRecordingUrl(dto.getRecordingUrl());
        
        Webinar updated = webinarRepository.save(webinar);
        return WebinarDTO.from(updated);
    }
    
    public void deleteWebinar(Long id) {
        webinarRepository.deleteById(id);
    }
    
    public List<WebinarDTO> searchWebinars(String query) {
        return webinarRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query, query)
            .stream()
            .map(WebinarDTO::from)
            .collect(Collectors.toList());
    }
}
