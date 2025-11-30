package com.notesapp.config;

import com.notesapp.entity.Note;
import com.notesapp.repository.NoteRepository;
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
        // Create sample notes
        Note note1 = new Note(
                "Welcome to Notes App",
                "This is your first note! You can create, edit, and share notes using this application.\n\n" +
                "Features:\n" +
                "• Create new notes with titles and content\n" +
                "• Edit existing notes\n" +
                "• Delete notes you no longer need\n" +
                "• Share notes with others using public links\n" +
                "• View all your notes in a clean, organized list\n\n" +
                "Get started by creating your own notes!"
        );

        Note note2 = new Note(
                "How to Share Notes",
                "Sharing notes is easy! Here's how:\n\n" +
                "1. Open any note you want to share\n" +
                "2. Click the 'Share' button\n" +
                "3. Copy the generated link\n" +
                "4. Send the link to anyone you want to share with\n\n" +
                "Shared notes are read-only, so your content stays safe while allowing others to view it."
        );

        Note note3 = new Note(
                "Tips for Better Note Taking",
                "Here are some tips to make the most of your notes:\n\n" +
                "• Use descriptive titles to easily find notes later\n" +
                "• Organize content with bullet points and headings\n" +
                "• Add dates and timestamps for important information\n" +
                "• Use the search feature to quickly find specific notes\n" +
                "• Regularly review and update your notes\n\n" +
                "Happy note-taking!"
        );

        // Save sample notes
        noteRepository.save(note1);
        noteRepository.save(note2);
        noteRepository.save(note3);

        System.out.println("Sample data initialized successfully!");
    }
}
