package notesapp.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteDTO {
	private Long id;
	private String title;
	private String content;
	private String shareToken;
	private String createdAt;
	private String updatedAt;
}
