package com.edustream.service;

import com.edustream.dto.WebinarDTO;
import com.edustream.entity.Registration;
import com.edustream.entity.User;
import com.edustream.entity.Webinar;
import com.edustream.repository.RegistrationRepository;
import com.edustream.repository.UserRepository;
import com.edustream.repository.WebinarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegistrationService {
    
    @Autowired
    private RegistrationRepository registrationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WebinarRepository webinarRepository;
    
    public void registerForWebinar(String email, Long webinarId) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Webinar webinar = webinarRepository.findById(webinarId)
            .orElseThrow(() -> new RuntimeException("Webinar not found"));
        
        if (registrationRepository.existsByUserAndWebinar(user, webinar)) {
            throw new RuntimeException("Already registered for this webinar");
        }
        
        Registration registration = new Registration();
        registration.setUser(user);
        registration.setWebinar(webinar);
        registrationRepository.save(registration);
    }
    
    public List<WebinarDTO> getMyRegistrations(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return registrationRepository.findByUser(user).stream()
            .map(r -> WebinarDTO.from(r.getWebinar()))
            .collect(Collectors.toList());
    }
    
    public void unregister(String email, Long webinarId) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Webinar webinar = webinarRepository.findById(webinarId)
            .orElseThrow(() -> new RuntimeException("Webinar not found"));
        
        Registration registration = registrationRepository.findByUserAndWebinar(user, webinar)
            .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        registrationRepository.delete(registration);
    }
}
