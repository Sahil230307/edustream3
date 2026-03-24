package com.edustream.service;

import com.edustream.dto.WebinarDTO;
import com.edustream.entity.User;
import com.edustream.entity.Webinar;
import com.edustream.entity.Wishlist;
import com.edustream.repository.UserRepository;
import com.edustream.repository.WebinarRepository;
import com.edustream.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {
    
    @Autowired
    private WishlistRepository wishlistRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WebinarRepository webinarRepository;
    
    public void addToWishlist(String email, Long webinarId) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Webinar webinar = webinarRepository.findById(webinarId)
            .orElseThrow(() -> new RuntimeException("Webinar not found"));
        
        if (wishlistRepository.existsByUserAndWebinar(user, webinar)) {
            throw new RuntimeException("Already in wishlist");
        }
        
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setWebinar(webinar);
        wishlistRepository.save(wishlist);
    }
    
    public void removeFromWishlist(String email, Long webinarId) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Webinar webinar = webinarRepository.findById(webinarId)
            .orElseThrow(() -> new RuntimeException("Webinar not found"));
        
        wishlistRepository.deleteByUserAndWebinar(user, webinar);
    }
    
    public List<WebinarDTO> getWishlist(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return wishlistRepository.findByUser(user).stream()
            .map(w -> WebinarDTO.from(w.getWebinar()))
            .collect(Collectors.toList());
    }
}
