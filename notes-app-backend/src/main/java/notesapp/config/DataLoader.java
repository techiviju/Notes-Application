 package notesapp.config;

import notesapp.entity.User;
import notesapp.enums.AuthProvider;
import notesapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

@Component
public class DataLoader {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder encoder;

    @PostConstruct
    public void createDefaultAdmin() {
        String adminEmail = "admin01@gmail.com";
        String adminPassword = "Zx@12345"; 

        // Check if admin exists
        if (userRepo.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setId(UUID.randomUUID().toString());
            admin.setName("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(encoder.encode(adminPassword));
            admin.setProvider(AuthProvider.LOCAL);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            admin.setRestricted(false); // Must NOT be restricted!
            admin.setRoles(Collections.singleton("ADMIN"));

            userRepo.save(admin);

            System.out.println("== Created default admin user: " + adminEmail + " (restricted: false, roles: ADMIN) ==");
        } else {
            System.out.println("== Admin already exists: " + adminEmail + " ==");
        }
    }
}
