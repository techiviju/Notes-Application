
package notesapp.repository;

import notesapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);

	// Find top 10 most recently created users (can be used for recent users
	// display)
	List<User> findTop10ByOrderByCreatedAtDesc();
}
