package notesapp.dto;

import java.util.Set;

public class AuthResponse {
    private String token;
    private String userId;
    private String email;
    private String name;
    private Set<String> roles;

    public AuthResponse(String token, String userId, String email, String name, Set<String> roles) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.roles = roles;
    }

    // getters and setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
}
