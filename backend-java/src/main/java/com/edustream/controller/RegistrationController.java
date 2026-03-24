package com.edustream.controller;

import com.edustream.dto.WebinarDTO;
import com.edustream.service.RegistrationService;
import com.edustream.service.WishlistService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/registrations")
@CrossOrigin("*")
@Slf4j
public class RegistrationController {
    
    @Autowired
    private RegistrationService registrationService;
    
    @Autowired
    private WishlistService wishlistService;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerForWebinar(@RequestBody Map<String, Long> request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            Long webinarId = request.get("webinarId");
            registrationService.registerForWebinar(email, webinarId);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"message\": \"Registered successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/my-registrations")
    public ResponseEntity<?> getMyRegistrations() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            List<WebinarDTO> registrations = registrationService.getMyRegistrations(email);
            return ResponseEntity.ok(registrations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/unregister/{webinarId}")
    public ResponseEntity<?> unregister(@PathVariable Long webinarId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            registrationService.unregister(email, webinarId);
            return ResponseEntity.ok("{\"message\": \"Unregistered successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping("/wishlist")
    public ResponseEntity<?> addToWishlist(@RequestBody Map<String, Long> request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            Long webinarId = request.get("webinarId");
            wishlistService.addToWishlist(email, webinarId);
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"message\": \"Added to wishlist\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/wishlist/{webinarId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long webinarId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            wishlistService.removeFromWishlist(email, webinarId);
            return ResponseEntity.ok("{\"message\": \"Removed from wishlist\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/wishlist/my-wishlist")
    public ResponseEntity<?> getWishlist() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            List<WebinarDTO> wishlist = wishlistService.getWishlist(email);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
