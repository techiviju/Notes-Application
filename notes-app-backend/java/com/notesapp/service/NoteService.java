package com.notesapp.service;

import com.notesapp.dto.NoteRequest;
import com.notesapp.dto.NoteResponse;
import com.notesapp.entity.Note;
import com.notesapp.exception.NoteNotFoundException;
import com.notesapp.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NoteService {
    
    private final NoteRepository noteRepository;
    
    @Autowired
    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }
    
    /**
     * Get all notes ordered by creation date (newest first)
     */
    @Transactional(readOnly = true)
    public List<NoteResponse> getAllNotes() {
        List<Note> notes = noteRepository.findAllOrderByCreatedAtDesc();
        return notes.stream()
                .map(NoteResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get a note by ID
     */
    @Transactional(readOnly = true)
    public NoteResponse getNoteById(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new NoteNotFoundException("Note not found with id: " + id));
        return new NoteResponse(note);
    }
    
    /**
     * Get a note by ID for public sharing (read-only)
     */
    @Transactional(readOnly = true)
    public NoteResponse getSharedNote(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new NoteNotFoundException("Shared note not found with id: " + id));
        return new NoteResponse(note);
    }
    
    /**
     * Create a new note
     */
    public NoteResponse createNote(NoteRequest noteRequest) {
        Note note = new Note();
        note.setTitle(noteRequest.getTitle());
        note.setContent(noteRequest.getContent());
        
        Note savedNote = noteRepository.save(note);
        return new NoteResponse(savedNote);
    }
    
    /**
     * Update an existing note
     */
    public NoteResponse updateNote(Long id, NoteRequest noteRequest) {
        Note existingNote = noteRepository.findById(id)
                .orElseThrow(() -> new NoteNotFoundException("Note not found with id: " + id));
        
        existingNote.setTitle(noteRequest.getTitle());
        existingNote.setContent(noteRequest.getContent());
        
        Note updatedNote = noteRepository.save(existingNote);
        return new NoteResponse(updatedNote);
    }
    
    /**
     * Delete a note by ID
     */
    public void deleteNote(Long id) {
        if (!noteRepository.existsById(id)) {
            throw new NoteNotFoundException("Note not found with id: " + id);
        }
        noteRepository.deleteById(id);
    }
    
    /**
     * Check if a note exists by ID
     */
    @Transactional(readOnly = true)
    public boolean noteExists(Long id) {
        return noteRepository.existsById(id);
    }
    
    /**
     * Get total count of notes
     */
    @Transactional(readOnly = true)
    public long getNoteCount() {
        return noteRepository.count();
    }
}
