package com.edustream.controller;

import com.edustream.dto.WebinarDTO;
import com.edustream.service.WebinarService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/webinars")
@CrossOrigin("*")
@Slf4j
public class WebinarController {
    
    @Autowired
    private WebinarService webinarService;
    
    @GetMapping
    public ResponseEntity<?> getAllWebinars() {
        try {
            List<WebinarDTO> webinars = webinarService.getAllWebinars();
            return ResponseEntity.ok(webinars);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getWebinarById(@PathVariable Long id) {
        try {
            WebinarDTO webinar = webinarService.getWebinarById(id);
            return ResponseEntity.ok(webinar);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchWebinars(@RequestParam String search) {
        try {
            List<WebinarDTO> webinars = webinarService.searchWebinars(search);
            return ResponseEntity.ok(webinars);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createWebinar(@RequestBody WebinarDTO dto) {
        try {
            WebinarDTO created = webinarService.createWebinar(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateWebinar(@PathVariable Long id, @RequestBody WebinarDTO dto) {
        try {
            WebinarDTO updated = webinarService.updateWebinar(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteWebinar(@PathVariable Long id) {
        try {
            webinarService.deleteWebinar(id);
            return ResponseEntity.ok("{\"message\": \"Webinar deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
