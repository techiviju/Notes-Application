 
package notesapp.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import notesapp.enums.AuthProvider;

@Entity
@Table(
    name = "users",
    indexes = {
        @Index(name = "idx_users_email_unique", columnList = "email", unique = true)
    }
)
public class User {

    @Id
    @Column(name = "id", columnDefinition = "CHAR(36)", nullable = false)
    private String id;

    @NotBlank
    @Email
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "password", length = 255)
    private String password;

    @Column(name = "profile_picture", length = 500)
    private String profilePicture;

    @Column(name = "bio", length = 500)
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", nullable = false, length = 20)
    private AuthProvider provider = AuthProvider.LOCAL;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_restricted", nullable = false)
    private boolean isRestricted = false;


    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private Set<String> roles = new HashSet<>();

    // --- Getters/Setters ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public AuthProvider getProvider() { return provider; }
    public void setProvider(AuthProvider provider) { this.provider = provider; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public boolean isRestricted() { return isRestricted; }
    public void setRestricted(boolean restricted) { isRestricted = restricted; }
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles != null ? roles : new HashSet<>(); }

    // --- Constructors ---
    public User() { }

    public User(
        String id,
        String email,
        String name,
        String password,
        String profilePicture,
        String bio,
        AuthProvider provider,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        boolean isRestricted,
        Set<String> roles
    ) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.password = password;
        this.profilePicture = profilePicture;
        this.bio = bio;
        this.provider = provider;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isRestricted = isRestricted;
        this.roles = roles != null ? roles : new HashSet<>();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String email;
        private String name;
        private String password;
        private String profilePicture;
        private String bio;
        private AuthProvider provider = AuthProvider.LOCAL;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private boolean isRestricted = false;
        private Set<String> roles = new HashSet<>();

        public Builder id(String id) { this.id = id; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder profilePicture(String profilePicture) { this.profilePicture = profilePicture; return this; }
        public Builder bio(String bio) { this.bio = bio; return this; }
        public Builder provider(AuthProvider provider) { this.provider = provider; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public Builder isRestricted(boolean isRestricted) { this.isRestricted = isRestricted; return this; }
        public Builder roles(Set<String> roles) { this.roles = roles != null ? roles : new HashSet<>(); return this; }

        public User build() {
            return new User(
                id, email, name, password, profilePicture, bio, provider,
                createdAt, updatedAt, isRestricted, roles
            );
        }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}


