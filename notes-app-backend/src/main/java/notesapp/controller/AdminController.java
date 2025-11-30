package notesapp.controller;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
//
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import notesapp.entity.User;
import notesapp.repository.NoteRepository;
import notesapp.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private NoteRepository noteRepo;

	@GetMapping("/stats")
	public ResponseEntity<Map<String, Object>> getAdminStats() {
		List<User> allUsers = userRepo.findAll();

		long totalUsers = allUsers.stream().filter(u -> safeHasRole(u, "USER")).count();
		long totalAdmins = allUsers.stream().filter(u -> safeHasRole(u, "ADMIN")).count();
		long restrictedUsers = allUsers.stream().filter(u -> u != null && u.isRestricted()).count();
		long totalNotes = noteRepo.count();

		List<Map<String, Object>> recentUsers = allUsers.stream().filter(Objects::nonNull).sorted(Comparator
				.comparing((User u) -> u.getCreatedAt() == null ? LocalDateTime.MIN : u.getCreatedAt()).reversed())
				.limit(10)
				.map(u -> Map.of("id", safeId(u), "email", safeString(u.getEmail()), "name", safeString(u.getName()),
						"profilePicture", safeString(u.getProfilePicture()), "bio", safeString(u.getBio()), "createdAt",
						u.getCreatedAt(), "roles", safeRoles(u), "restricted", u.isRestricted(), "notesCount",
						safeCountNotes(u.getId())))
				.collect(Collectors.toList());

		return ResponseEntity.ok(Map.of("totalUsers", totalUsers, "totalAdmins", totalAdmins, "totalNotes", totalNotes,
				"restrictedUsers", restrictedUsers, "recentUsers", recentUsers));
	}

	private static Object safeId(User user) {
		return user != null ? user.getId() : "";
	}

	private static String safeString(String s) {
		return s == null ? "" : s;
	}

	private static Set<String> safeRoles(User user) {
		return user != null && user.getRoles() != null ? user.getRoles() : Set.of();
	}

	private long safeCountNotes(String userId) {
		if (userId == null)
			return 0L;
		try {
			return noteRepo.countByUserId(userId);
		} catch (Exception e) {
			System.out.println("Failed countByUserId for id=" + userId + ": " + e.getMessage());
			return 0L;
		}
	}

	private static boolean safeHasRole(User user, String role) {
		return user != null && user.getRoles() != null && user.getRoles().contains(role);
	}

	@GetMapping("/users")
	public ResponseEntity<List<Map<String, Object>>> listUsers() {
		List<Map<String, Object>> users = userRepo.findAll().stream().filter(Objects::nonNull)
				.map(u -> Map.of("id", safeId(u), "email", safeString(u.getEmail()), "name", safeString(u.getName()),
						"profilePicture", safeString(u.getProfilePicture()), "bio", safeString(u.getBio()), "createdAt",
						u.getCreatedAt(), "roles", safeRoles(u), "restricted", u.isRestricted(), "notesCount",
						safeCountNotes(u.getId())))
				.collect(Collectors.toList());
		return ResponseEntity.ok(users);
	}

	@PostMapping("/restrict/{userId}")
	public ResponseEntity<?> restrictUser(@PathVariable String userId, @RequestParam boolean restrict) {
		User user = userRepo.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

		// Add this block right here:
		if (user.getRoles() != null && user.getRoles().contains("ADMIN")) {
			return ResponseEntity.badRequest().body(Map.of("error", "Cannot restrict admin user."));
		}

		user.setRestricted(restrict);
		userRepo.save(user);
		return ResponseEntity.ok(Map.of("success", true));
	}

	@DeleteMapping("/users/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable String id) {
		noteRepo.deleteAll(noteRepo.findByUserId(id));
		userRepo.deleteById(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping("/users/{id}/role")
	public ResponseEntity<?> updateUserRole(@PathVariable String id, @RequestParam String role,
			@RequestParam boolean add) {
		User user = userRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));

		if ("ADMIN".equals(role) && !add && user.getEmail().equalsIgnoreCase("admin@example.com")) {
			// You can add your logic to protect the main admin
			return ResponseEntity.badRequest().body(Map.of("error", "Cannot remove ADMIN from main admin"));
		}

		Set<String> roles = new HashSet<>(user.getRoles());
		if (add)
			roles.add(role);
		else
			roles.remove(role);

		user.setRoles(roles);
		userRepo.save(user);
		return ResponseEntity.ok(Map.of("success", true, "roles", roles));
	}

}
