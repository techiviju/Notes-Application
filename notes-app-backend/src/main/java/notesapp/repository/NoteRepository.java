package notesapp.repository;

import notesapp.entity.Note;
import notesapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    // Find all notes owned by a specific user
    List<Note> findByUser(User user);

    // Find single note owned by a user
    Optional<Note> findByIdAndUser(Long id, User user);

    // Find shared note by share token
    Optional<Note> findByShareToken(String shareToken);

    // Custom method for counting notes for a user by userId string (to be used in Admin stats)
    long countByUserId(String userId);
    
 // Add THIS method to your NoteRepository:
    List<Note> findByUserId(String userId);

}

 