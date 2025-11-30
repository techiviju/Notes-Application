package notesapp.controller;

import notesapp.dto.AuthRequest;
import notesapp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

	private final AuthService authService;

	@Autowired
	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody AuthRequest req) {
		try {
			Map<String, Object> response = authService.register(req);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody AuthRequest req) {
		try {
			Map<String, Object> response = authService.login(req);
			return ResponseEntity.ok(response);
		} catch (AuthService.RestrictedUserException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body("Your account is restricted. Please contact support.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		}
	}
}
