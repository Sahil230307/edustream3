package com.edustream.service;

import com.edustream.dto.LoginRequest;
import com.edustream.dto.LoginResponse;
import com.edustream.dto.SignupRequest;
import com.edustream.dto.UserResponse;
import com.edustream.entity.User;
import com.edustream.repository.UserRepository;
import com.edustream.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public UserResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
        
        User savedUser = userRepository.save(user);
        return UserResponse.from(savedUser);
    }
    
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().toString());
        
        return LoginResponse.builder()
            .token(token)
            .user(UserResponse.from(user))
            .message("Login successful")
            .build();
    }
    
    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return UserResponse.from(user);
    }
}
