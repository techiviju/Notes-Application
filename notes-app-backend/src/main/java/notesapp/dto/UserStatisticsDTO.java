package notesapp.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class UserStatisticsDTO {
	private long totalUsers;
	private long totalAdmins;
	private long totalNotes;
	private long restrictedUsers;
	private List<UserInfoDTO> recentUsers;

	public UserStatisticsDTO(long totalUsers, long totalAdmins, long totalNotes, long restrictedUsers,
			List<UserInfoDTO> recentUsers) {
		this.totalUsers = totalUsers;
		this.totalAdmins = totalAdmins;
		this.totalNotes = totalNotes;
		this.restrictedUsers = restrictedUsers;
		this.recentUsers = recentUsers;
	}

	public long getTotalUsers() {
		return totalUsers;
	}

	public void setTotalUsers(long totalUsers) {
		this.totalUsers = totalUsers;
	}

	public long getTotalAdmins() {
		return totalAdmins;
	}

	public void setTotalAdmins(long totalAdmins) {
		this.totalAdmins = totalAdmins;
	}

	public long getTotalNotes() {
		return totalNotes;
	}

	public void setTotalNotes(long totalNotes) {
		this.totalNotes = totalNotes;
	}

	public long getRestrictedUsers() {
		return restrictedUsers;
	}

	public void setRestrictedUsers(long restrictedUsers) {
		this.restrictedUsers = restrictedUsers;
	}

	public List<UserInfoDTO> getRecentUsers() {
		return recentUsers;
	}

	public void setRecentUsers(List<UserInfoDTO> recentUsers) {
		this.recentUsers = recentUsers;
	}

	public static class UserInfoDTO {
		private String id;
		private String email;
		private String name;
		private String profilePicture;
		private String bio;
		private Set<String> roles;
		private boolean restricted;
		private LocalDateTime createdAt;
		private long notesCount;

		public UserInfoDTO(String id, String email, String name, String profilePicture, String bio, Set<String> roles,
				boolean restricted, LocalDateTime createdAt, long notesCount) {
			this.id = id;
			this.email = email;
			this.name = name;
			this.profilePicture = profilePicture;
			this.bio = bio;
			this.roles = roles;
			this.restricted = restricted;
			this.createdAt = createdAt;
			this.notesCount = notesCount;
		}

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getEmail() {
			return email;
		}

		public void setEmail(String email) {
			this.email = email;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getProfilePicture() {
			return profilePicture;
		}

		public void setProfilePicture(String profilePicture) {
			this.profilePicture = profilePicture;
		}

		public String getBio() {
			return bio;
		}

		public void setBio(String bio) {
			this.bio = bio;
		}

		public Set<String> getRoles() {
			return roles;
		}

		public void setRoles(Set<String> roles) {
			this.roles = roles;
		}

		public boolean isRestricted() {
			return restricted;
		}

		public void setRestricted(boolean restricted) {
			this.restricted = restricted;
		}

		public LocalDateTime getCreatedAt() {
			return createdAt;
		}

		public void setCreatedAt(LocalDateTime createdAt) {
			this.createdAt = createdAt;
		}

		public long getNotesCount() {
			return notesCount;
		}

		public void setNotesCount(long notesCount) {
			this.notesCount = notesCount;
		}
	}
}
