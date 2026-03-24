package com.edustream.dto;

import com.edustream.entity.Webinar;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebinarDTO {
    private Long id;
    private String title;
    private String speaker;
    private String speakerEmail;
    private String date;
    private String time;
    private String description;
    private String category;
    private String difficulty;
    private Integer maxCapacity;
    private Integer registeredCount;
    private String imageUrl;
    private String recordingUrl;
    
    public static WebinarDTO from(Webinar webinar) {
        return WebinarDTO.builder()
            .id(webinar.getId())
            .title(webinar.getTitle())
            .speaker(webinar.getSpeaker())
            .speakerEmail(webinar.getSpeakerEmail())
            .date(webinar.getDate())
            .time(webinar.getTime())
            .description(webinar.getDescription())
            .category(webinar.getCategory())
            .difficulty(webinar.getDifficulty())
            .maxCapacity(webinar.getMaxCapacity())
            .registeredCount(webinar.getRegisteredCount())
            .imageUrl(webinar.getImageUrl())
            .recordingUrl(webinar.getRecordingUrl())
            .build();
    }
}
