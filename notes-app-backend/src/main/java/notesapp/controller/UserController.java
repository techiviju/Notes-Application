package notesapp.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import notesapp.dto.UserProfileDTO;
import notesapp.entity.User;
import notesapp.repository.UserRepository;

@RestController
@RequestMapping("/api/user")
//@CrossOrigin(origins = "*")
public class UserController {

	@Autowired
	private UserRepository userRepository;

	/**
	 * GET /api/user/profile Returns the current authenticated user's profile
	 */
	@GetMapping("/profile")
	public ResponseEntity<UserProfileDTO> getProfile(@AuthenticationPrincipal UserDetails principal) {
		User user = userRepository.findByEmail(principal.getUsername())
				.orElseThrow(() -> new RuntimeException("User not found"));

		UserProfileDTO dto = new UserProfileDTO(user);

		// ✅ Log for debugging
		System.out.println("✅ Profile fetched for: " + user.getEmail() + " | Name: " + user.getName());

		return ResponseEntity.ok(dto);
	}

	/**
	 * PUT /api/user/profile Updates the current user's profile (name, bio,
	 * profilePicture) Body: { "name": "...", "bio": "...", "profilePicture": "..."
	 * }
	 */
	@PutMapping("/profile")
	public ResponseEntity<UserProfileDTO> updateProfile(@AuthenticationPrincipal UserDetails principal,
			@RequestBody Map<String, String> body) {

		User user = userRepository.findByEmail(principal.getUsername())
				.orElseThrow(() -> new RuntimeException("User not found"));

		// Update fields if provided
		if (body.containsKey("name") && body.get("name") != null && !body.get("name").trim().isEmpty()) {
			user.setName(body.get("name").trim());
		}

		if (body.containsKey("bio")) {
			user.setBio(body.get("bio"));
		}

		if (body.containsKey("profilePicture")) {
			user.setProfilePicture(body.get("profilePicture"));
		}

		user.setUpdatedAt(LocalDateTime.now());
		userRepository.save(user);

		UserProfileDTO dto = new UserProfileDTO(user);

		// ✅ Log for debugging
		System.out.println("✅ Profile updated for: " + user.getEmail() + " | New Name: " + user.getName());

		return ResponseEntity.ok(dto);
	}

	/**
	 * POST /api/user/upload-profile-pic Uploads a profile picture file Form-data:
	 * file (MultipartFile)
	 */
	@PostMapping("/upload-profile-pic")
	public ResponseEntity<Map<String, Object>> uploadProfilePic(@AuthenticationPrincipal UserDetails principal,
			@RequestParam("file") MultipartFile file) {

		if (file.isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of("error", "No file uploaded"));
		}

		User user = userRepository.findByEmail(principal.getUsername())
				.orElseThrow(() -> new RuntimeException("User not found"));

		// Delete old profile pic if not default
		String oldPath = user.getProfilePicture();
		if (oldPath != null && !oldPath.isEmpty() && !oldPath.contains("default")) {
			Path oldFile = Paths.get(".").toAbsolutePath().normalize()
					.resolve(oldPath.startsWith("/") ? oldPath.substring(1) : oldPath);
			try {
				Files.deleteIfExists(oldFile);
			} catch (IOException ignored) {
				// Ignore deletion errors
			}
		}

		try {
			// Create upload directory if not exists
			String uploadDir = "uploads/profile-pics/";
			Files.createDirectories(Paths.get(uploadDir));

			// Generate unique filename
			String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
			String uuidFile = UUID.randomUUID().toString() + "_" + originalFilename;
			Path path = Paths.get(uploadDir).resolve(uuidFile);

			// Save file
			Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

			// Update user profile picture URL
			String url = "/" + uploadDir + uuidFile;
			user.setProfilePicture(url);
			user.setUpdatedAt(LocalDateTime.now());
			userRepository.save(user);

			System.out.println("✅ Profile picture uploaded for: " + user.getEmail() + " | URL: " + url);

			return ResponseEntity.ok(Map.of("profilePictureUrl", url));
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(Map.of("error", "File upload error: " + e.getMessage()));
		}
	}
}
