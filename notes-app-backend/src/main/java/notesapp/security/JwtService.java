package notesapp.security;

import notesapp.entity.User;
import notesapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Service
public class JwtService {

    @Autowired
    private UserRepository userRepo;

    // Replace with your actual JWT secret (should be same as in your JWT generation config)
    private static final String JWT_SECRET = "your_secret_here"; 

    // Get currently authenticated user from JWT token
    public User getUserFromToken(String header) {
        // Remove Bearer prefix if present
        String token = header.startsWith("Bearer ") ? header.substring(7) : header;
        Claims claims = Jwts.parser()
                .setSigningKey(JWT_SECRET.getBytes())
                .parseClaimsJws(token)
                .getBody();

        // Use 'sub' or 'username' as the key for email (adapt to your token content!)
        String email = claims.getSubject(); // or (String) claims.get("username") if needed

        return userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
