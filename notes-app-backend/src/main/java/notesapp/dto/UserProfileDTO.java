 package notesapp.dto;

import java.time.LocalDateTime;
import java.util.Set;

import notesapp.entity.User;
import notesapp.enums.AuthProvider;

public class UserProfileDTO {
    private String id;
    private String email;
    private String name;
    private String profilePicture;
    private String bio;
    private AuthProvider provider;
    private Set<String> roles;
    private boolean restricted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public UserProfileDTO() {}

    // Full constructor
    public UserProfileDTO(String id, String email, String name, String profilePicture, String bio,
                         AuthProvider provider, Set<String> roles, boolean restricted,
                         LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.profilePicture = profilePicture;
        this.bio = bio;
        this.provider = provider;
        this.roles = roles;
        this.restricted = restricted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // CRITICAL: Constructor from User entity
    public UserProfileDTO(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();  // ✅ Must extract name
        this.profilePicture = user.getProfilePicture();
        this.bio = user.getBio();
        this.provider = user.getProvider();
        this.roles = user.getRoles();
        this.restricted = user.isRestricted();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public AuthProvider getProvider() { return provider; }
    public void setProvider(AuthProvider provider) { this.provider = provider; }
    
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
    
    public boolean isRestricted() { return restricted; }
    public void setRestricted(boolean restricted) { this.restricted = restricted; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
