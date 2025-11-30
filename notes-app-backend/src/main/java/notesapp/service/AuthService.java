
package notesapp.service;

import notesapp.dto.AuthRequest;
import notesapp.dto.UserProfileDTO;
import notesapp.entity.User;
import notesapp.enums.AuthProvider;
import notesapp.repository.UserRepository;
import notesapp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public static class RestrictedUserException extends RuntimeException {
        public RestrictedUserException() { 
            super("User account restricted"); 
        }
    }

    public Map<String, Object> login(AuthRequest req) {
        // Find user
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        // Check if restricted
        if (user.isRestricted()) {
            throw new RestrictedUserException();
        }
        
        // Verify password
        if (user.getPassword() == null || !passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        //  Generate JWT token with roles
        String token = jwtUtil.generateToken(user.getEmail(), user.getRoles());
        
        // Create DTO with all fields including name
        UserProfileDTO dto = new UserProfileDTO(user);
        
        // Build response
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", dto);
        
        // Log for debugging
        System.out.println("✅ Login successful for: " + user.getEmail() 
                + " | Name: " + user.getName() 
                + " | Roles: " + user.getRoles());
        
        return result;
    }

    public Map<String, Object> register(AuthRequest req) {
        // Check if user exists
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        
        // Create new user
        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setEmail(req.getEmail());
        
        //  Ensure name is set properly
        String name = (req.getName() != null && !req.getName().trim().isEmpty()) 
                      ? req.getName().trim() 
                      : req.getEmail().split("@")[0];
        user.setName(name);
        
        user.setProvider(AuthProvider.LOCAL);
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setProfilePicture("default.png");
        user.setBio("");
        
        LocalDateTime now = LocalDateTime.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        user.setRestricted(false);
        
        //  Add USER role by default
        user.setRoles(new HashSet<>(Collections.singletonList("USER")));
        
        user = userRepository.save(user);
        
        //  Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRoles());
        
        // Create DTO
        UserProfileDTO dto = new UserProfileDTO(user);
        
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", dto);
        
        System.out.println("✅ Registration successful for: " + user.getEmail() 
                + " | Name: " + user.getName());
        
        return result;
    }
}
