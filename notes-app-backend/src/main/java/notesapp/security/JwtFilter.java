
package notesapp.security;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.web.authentication.WebSecurityConfigurerAdapter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import notesapp.repository.UserRepository;

@Component
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private UserRepository userRepo;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {

		// Get Authorization header
		String header = request.getHeader("Authorization");

		// Check if header exists and starts with "Bearer "
		if (header != null && header.startsWith("Bearer ")) {
			String token = header.substring(7); // Remove "Bearer " prefix

			try {
				// Validate token
				if (jwtUtil.isValidate(token)) {
					String email = jwtUtil.getEmail(token);

					// Fetch user from database to verify they exist and are not restricted
					notesapp.entity.User userEntity = userRepo.findByEmail(email).orElse(null);

					if (userEntity != null && !userEntity.isRestricted()) {
						// Get roles from token
						Set<String> roles = jwtUtil.getRoles(token);

						// Map roles to authorities with ROLE_ prefix
						List<SimpleGrantedAuthority> authorities = roles.stream()
								.map(role -> new SimpleGrantedAuthority("ROLE_" + role)).collect(Collectors.toList());

						// Create UserDetails object
						UserDetails userDetails = User.builder().username(email).password("") // Password not needed for
																								// JWT auth
								.authorities(authorities).build();

						// Create authentication token
						UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
								userDetails, null, authorities);

						// Set authentication in security context
						SecurityContextHolder.getContext().setAuthentication(authToken);

						// Log for debugging
						System.out.println("✅ JWT Auth successful for: " + email + " | Authorities: " + authorities);
					} else {
						System.out.println("❌ User not found or restricted: " + email);
					}
				}
			} catch (Exception e) {
				System.out.println("❌ JWT validation failed: " + e.getMessage());
			}
		}

		// Continue filter chain
		chain.doFilter(request, response);
	}
}
