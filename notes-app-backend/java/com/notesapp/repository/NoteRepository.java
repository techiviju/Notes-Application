package com.notesapp.repository;

import com.notesapp.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    
    /**
     * Find all notes ordered by creation date (newest first)
     */
    @Query("SELECT n FROM Note n ORDER BY n.createdAt DESC")
    List<Note> findAllOrderByCreatedAtDesc();
    
    /**
     * Find a note by ID (for public sharing)
     */
    Optional<Note> findById(Long id);
    
    /**
     * Check if a note exists by ID
     */
    boolean existsById(Long id);
    
    /**
     * Find notes by title containing (case-insensitive)
     */
    @Query("SELECT n FROM Note n WHERE LOWER(n.title) LIKE LOWER(CONCAT('%', :title, '%')) ORDER BY n.createdAt DESC")
    List<Note> findByTitleContainingIgnoreCase(@Param("title") String title);
    
    /**
     * Find notes by content containing (case-insensitive)
     */
    @Query("SELECT n FROM Note n WHERE LOWER(n.content) LIKE LOWER(CONCAT('%', :content, '%')) ORDER BY n.createdAt DESC")
    List<Note> findByContentContainingIgnoreCase(@Param("content") String content);
}
