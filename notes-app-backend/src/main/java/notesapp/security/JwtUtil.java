 
package notesapp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;

@Component
public class JwtUtil {

    @Value("${jwt.secret:noteshub-super-secret-key-change-in-production-must-be-256-bits-long}")
    private String secret;

    @Value("${jwt.expiration:86400000}") // 24 hours in milliseconds
    private Long expiration;

    /**
     * Get signing key for JWT
     */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Generate JWT token with email and roles
     */
    public String generateToken(String email, Set<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", new ArrayList<>(roles));
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extract email from token
     */
    public String getEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Extract roles from token
     */
    @SuppressWarnings("unchecked")
    public Set<String> getRoles(String token) {
        Claims claims = extractAllClaims(token);
        List<String> rolesList = (List<String>) claims.get("roles");
        return rolesList != null ? new HashSet<>(rolesList) : new HashSet<>();
    }

    /**
     * Validate token
     */
    public boolean isValidate(String token) {
        try {
            extractAllClaims(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extract all claims from token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Check if token is expired
     */
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    /**
     * Validate token against user email
     */
    public boolean isTokenValid(String token, String email) {
        final String tokenEmail = getEmail(token);
        return (tokenEmail.equals(email) && !isTokenExpired(token));
    }
}
