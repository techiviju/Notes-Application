package notesapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import notesapp.dto.NoteRequest;
import notesapp.dto.NoteResponse;
import notesapp.entity.Note;
import notesapp.entity.User;
import notesapp.exception.NoteNotFoundException;
import notesapp.repository.NoteRepository;
import notesapp.repository.UserRepository;

@Service
@Transactional
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    @Autowired
    public NoteService(NoteRepository noteRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getAllNotesForUser(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoteNotFoundException("User not found"));
        
        List<Note> notes = noteRepository.findByUser(user);
        
        System.out.println("=== SERVICE: Getting notes for user ===");
        System.out.println("Email: " + email);
        System.out.println("User ID: " + user.getId());
        System.out.println("Found notes: " + notes.size());
        
        return notes.stream().map(NoteResponse::from).collect(Collectors.toList());
    }

    public NoteResponse createNoteForUser(String email, NoteRequest noteRequest) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoteNotFoundException("User not found"));

        Note note = new Note();
        note.setTitle(noteRequest.getTitle());
        note.setContent(noteRequest.getContent());
        note.setShareToken("share-" + System.currentTimeMillis()); // Simple share token
        note.setUser(user);
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());

        Note savedNote = noteRepository.save(note);
        
        System.out.println("=== SERVICE: Created note ===");
        System.out.println("Note ID: " + savedNote.getId());
        System.out.println("User ID: " + savedNote.getUser().getId());
        System.out.println("User Email: " + savedNote.getUser().getEmail());
        
        return NoteResponse.from(savedNote);
    }

    @Transactional(readOnly = true)
    public NoteResponse getNoteByIdForUser(String email, Long id) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoteNotFoundException("User not found"));
        Note note = noteRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new NoteNotFoundException("Note not found with id: " + id));
        return NoteResponse.from(note);
    }

    public NoteResponse updateNoteForUser(String email, Long id, NoteRequest noteRequest) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoteNotFoundException("User not found"));
        Note note = noteRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new NoteNotFoundException("Note not found with id: " + id));
        note.setTitle(noteRequest.getTitle());
        note.setContent(noteRequest.getContent());
        note.setUpdatedAt(LocalDateTime.now());
        Note updatedNote = noteRepository.save(note);
        return NoteResponse.from(updatedNote);
    }

    public void deleteNoteForUser(String email, Long id) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoteNotFoundException("User not found"));
        Note note = noteRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new NoteNotFoundException("Note not found with id: " + id));
        noteRepository.delete(note);
    }
}
