package notesapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class NoteRequest {
    
    @NotBlank(message = "Title cannot be blank")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;
    
    private String content;
    private String shareToken;
    
    public String getShareToken() {
		return shareToken;
	}

	public void setShareToken(String shareToken) {
		this.shareToken = shareToken;
	}

	// Default constructor
    public NoteRequest() {}
    
    // Constructor with title and content
    public NoteRequest(String title, String content) {
        this.title = title;
        this.content = content;
    }
    
    // Getters and Setters
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    @Override
    public String toString() {
        return "NoteRequest{" +
                "title='" + title + '\'' +
                ", content='" + content + '\'' +
                '}';
        
    }
}
