package notesapp.config;

import notesapp.entity.Note;
import notesapp.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final NoteRepository noteRepository;

    @Autowired
    public DataInitializer(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only initialize data if the database is empty
        if (noteRepository.count() == 0) {
            initializeSampleData();
        }
    }

    private void initializeSampleData() {
 
    }
}
