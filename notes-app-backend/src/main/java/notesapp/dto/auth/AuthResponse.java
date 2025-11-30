package notesapp.dto.auth;

import notesapp.entity.User;

public class AuthResponse {
    private String token;
    private String userId;
    private String email;
    private String name;
    private String profilePicture;

    public AuthResponse() {}

    public AuthResponse(String token, String userId, String email, String name, String profilePicture) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.profilePicture = profilePicture;
    }
 // Add a constructor that takes a User
    public AuthResponse(User user) {
        this.userId = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        // Set token later, or add another constructor/field for token
    }
    // Optional: for JWT or session usage
    public AuthResponse(User user, String token) {
        this.userId = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.token = token;
    }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
}


