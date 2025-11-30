 package notesapp.dto;

import notesapp.entity.Note;

public class NoteResponse {
    private Long id;
    private String title;
    private String content;
    private String createdAt;   // String for JSON compatibility!
    private String updatedAt;   // String for JSON compatibility!
    private String shareToken;

    // Default constructor
    public NoteResponse() {}

    // Constructor with all fields (useful if ever needed)
    public NoteResponse(Long id, String title, String content, String createdAt, String updatedAt, String shareToken) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.shareToken = shareToken;
    }

    // Static factory: always use this when converting from entity
    public static NoteResponse from(Note note) {
        NoteResponse res = new NoteResponse();
        res.setId(note.getId());
        res.setTitle(note.getTitle());
        res.setContent(note.getContent());
        res.setShareToken(note.getShareToken());
        // Always map date as string
        res.setCreatedAt(note.getCreatedAt() == null ? null : note.getCreatedAt().toString());
        res.setUpdatedAt(note.getUpdatedAt() == null ? null : note.getUpdatedAt().toString());
        return res;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public String getShareToken() { return shareToken; }
    public void setShareToken(String shareToken) { this.shareToken = shareToken; }

    @Override
    public String toString() {
        return "NoteResponse{" +
            "id=" + id +
            ", title='" + title + '\'' +
            ", content='" + content + '\'' +
            ", createdAt='" + createdAt + '\'' +
            ", updatedAt='" + updatedAt + '\'' +
            ", shareToken='" + shareToken + '\'' +
            '}';
    }
}
