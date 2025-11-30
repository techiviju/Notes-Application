
package notesapp.service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import notesapp.entity.User;
import notesapp.enums.AuthProvider;
import notesapp.repository.UserRepository;

@Service("userServiceImpl")
public class UserService implements UserDetailsService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional(readOnly = true)
	public Optional<User> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	@Transactional
	public User registerLocalUser(String email, String name, String rawPassword) {
		User user = new User();
		user.setEmail(email);
		user.setName(name);
		user.setProvider(AuthProvider.LOCAL);
		user.setPassword(passwordEncoder.encode(rawPassword));
		return userRepository.save(user);
	}

	@Transactional
	public User createOrUpdateGoogleUser(String email, String name, String picture) {
		return userRepository.findByEmail(email).map(existing -> {
			existing.setName(name);
			existing.setProfilePicture(picture);
			existing.setProvider(AuthProvider.GOOGLE);
			return userRepository.save(existing);
		}).orElseGet(() -> {
			User user = new User();
			user.setEmail(email);
			user.setName(name);
			user.setProfilePicture(picture);
			user.setProvider(AuthProvider.GOOGLE);
			return userRepository.save(user);
		});
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));

		if (user.isRestricted()) {
			// Spring Security will block login if we throw this
			throw new UsernameNotFoundException("Your account is restricted. Please contact support.");
		}

		Collection<? extends GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
		return new org.springframework.security.core.userdetails.User(user.getEmail(),
				user.getPassword() == null ? "" : user.getPassword(), authorities);
	}
}
