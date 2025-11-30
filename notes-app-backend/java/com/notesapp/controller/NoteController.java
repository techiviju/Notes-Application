package com.notesapp.controller;

import com.notesapp.dto.NoteRequest;
import com.notesapp.dto.NoteResponse;
import com.notesapp.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NoteController {
    
    private final NoteService noteService;
    
    @Autowired
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }
     
    /**
     * Get all notes
     * GET /api/notes
     */
    @GetMapping
    public ResponseEntity<List<NoteResponse>> getAllNotes() {
        List<NoteResponse> notes = noteService.getAllNotes();
        return ResponseEntity.ok(notes);
    }
    
    /**
     * Get a note by ID
     * GET /api/notes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<NoteResponse> getNoteById(@PathVariable Long id) {
        NoteResponse note = noteService.getNoteById(id);
        return ResponseEntity.ok(note);
    }
    
    /**
     * Get a shared note (public access)
     * GET /api/notes/share/{id}
     */
    @GetMapping("/share/{id}")
    public ResponseEntity<NoteResponse> getSharedNote(@PathVariable Long id) {
        NoteResponse note = noteService.getSharedNote(id);
        return ResponseEntity.ok(note);
    }
    
    /**
     * Create a new note
     * POST /api/notes
     */
    @PostMapping
    public ResponseEntity<NoteResponse> createNote(@Valid @RequestBody NoteRequest noteRequest) {
        NoteResponse createdNote = noteService.createNote(noteRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNote);
    }
    
    /**
     * Update an existing note
     * PUT /api/notes/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<NoteResponse> updateNote(@PathVariable Long id, @Valid @RequestBody NoteRequest noteRequest) {
        NoteResponse updatedNote = noteService.updateNote(id, noteRequest);
        return ResponseEntity.ok(updatedNote);
    }
    
    /**
     * Delete a note
     * DELETE /api/notes/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get note count (optional endpoint for statistics)
     * GET /api/notes/count
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getNoteCount() {
        long count = noteService.getNoteCount();
        return ResponseEntity.ok(Map.of("count", count));
    }
}
