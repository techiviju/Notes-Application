package notesapp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import notesapp.dto.NoteRequest;
import notesapp.dto.NoteResponse;
import notesapp.entity.Note;
import notesapp.entity.User;
import notesapp.exception.NoteNotFoundException;
import notesapp.repository.NoteRepository;
import notesapp.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notes")
//@CrossOrigin(origins = "*", maxAge = 3600)
public class NoteController {
	private final NoteRepository noteRepo;
	private final UserRepository userRepo;

	public NoteController(NoteRepository noteRepo, UserRepository userRepo) {
		this.noteRepo = noteRepo;
		this.userRepo = userRepo;
	}

	// Helper: get user and block restricted
	private User getActiveUser(String email) {
		User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		if (user.isRestricted()) {
			throw new RestrictedUserException();
		}
		return user;
	}

	// Create Note
	@PostMapping
	public ResponseEntity<?> createNote(@AuthenticationPrincipal UserDetails principal,
			@RequestBody NoteRequest noteRequest) {
		try {
			User user = getActiveUser(principal.getUsername());
			Note note = new Note();
			note.setTitle(noteRequest.getTitle());
			note.setContent(noteRequest.getContent());
			note.setShareToken(noteRequest.getShareToken());
			note.setUser(user);
			note.setCreatedAt(LocalDateTime.now());
			note.setUpdatedAt(LocalDateTime.now());
			Note savedNote = noteRepo.save(note);
			return ResponseEntity.status(HttpStatus.CREATED).body(NoteResponse.from(savedNote));
		} catch (RestrictedUserException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Your account is restricted. Action not allowed.");
		}
	}

	// List all notes for current user
	@GetMapping("/user")
	public ResponseEntity<?> getAllNotesForUser(@AuthenticationPrincipal UserDetails principal) {
		try {
			User user = getActiveUser(principal.getUsername());
			List<Note> notes = noteRepo.findByUser(user);
			return ResponseEntity.ok(notes.stream().map(NoteResponse::from).collect(Collectors.toList()));
		} catch (RestrictedUserException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Your account is restricted. Action not allowed.");
		}
	}

	// Get single note by ID
	@GetMapping("/{id}")
	public ResponseEntity<?> getNoteById(@AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
		try {
			User user = getActiveUser(principal.getUsername());
			Note note = noteRepo.findByIdAndUser(id, user).orElseThrow(() -> new NoteNotFoundException("Not found"));
			return ResponseEntity.ok(NoteResponse.from(note));
		} catch (RestrictedUserException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Your account is restricted. Action not allowed.");
		}
	}

	// Update note
	@PutMapping("/{id}")
	public ResponseEntity<?> updateNote(@AuthenticationPrincipal UserDetails principal, @PathVariable Long id,
			@RequestBody NoteRequest noteRequest) {
		try {
			User user = getActiveUser(principal.getUsername());
			Note note = noteRepo.findByIdAndUser(id, user).orElseThrow(() -> new NoteNotFoundException("Not found"));
			note.setTitle(noteRequest.getTitle());
			note.setContent(noteRequest.getContent());
			note.setShareToken(noteRequest.getShareToken());
			note.setUpdatedAt(LocalDateTime.now());
			noteRepo.save(note);
			return ResponseEntity.ok(NoteResponse.from(note));
		} catch (RestrictedUserException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Your account is restricted. Action not allowed.");
		}
	}

	// Public share endpoint
	@GetMapping("/share/{token}")
	public ResponseEntity<NoteResponse> getSharedNote(@PathVariable String token) {
		Note note = noteRepo.findByShareToken(token)
				.orElseThrow(() -> new NoteNotFoundException("Not found or not shared"));
		return ResponseEntity.ok(NoteResponse.from(note));
	}

	// Delete note
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteNote(@AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
		try {
			User user = getActiveUser(principal.getUsername());
			Note note = noteRepo.findByIdAndUser(id, user).orElseThrow(() -> new NoteNotFoundException("Not found"));
			noteRepo.delete(note);
			return ResponseEntity.noContent().build();
		} catch (RestrictedUserException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Your account is restricted. Action not allowed.");
		}
	}

	// --- Helper exception ---
	@ResponseStatus(HttpStatus.FORBIDDEN)
	public static class RestrictedUserException extends RuntimeException {
	}
}
