package com.edustream.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "webinars")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Webinar {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, length = 100)
    private String speaker;
    
    @Column(length = 100)
    private String speakerEmail;
    
    @Column(nullable = false, length = 50)
    private String date;
    
    @Column(length = 50)
    private String time;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 50)
    private String category;
    
    @Column(length = 50)
    private String difficulty;
    
    @Column(name = "max_capacity")
    private Integer maxCapacity = 100;
    
    @Column(name = "registered_count")
    private Integer registeredCount = 0;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @Column(name = "recording_url", length = 500)
    private String recordingUrl;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
