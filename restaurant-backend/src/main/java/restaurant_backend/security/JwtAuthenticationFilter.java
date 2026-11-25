package restaurant_backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import restaurant_backend.entity.User;
import restaurant_backend.repository.UserRepository;
import restaurant_backend.service.JwtService;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        // No Authorization header
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token =
                authHeader.substring(7);

        try {

            String email =
                    jwtService.extractEmail(token);

            // Only authenticate if SecurityContext is empty
            if (email != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                User user =
                        userRepository
                                .findByEmail(email)
                                .orElse(null);

                if (user != null &&
                        jwtService.isTokenValid(
                                token,
                                user
                        )) {

                    SimpleGrantedAuthority authority =
                            new SimpleGrantedAuthority(
                                    "ROLE_" +
                                            user.getRole().name()
                            );

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    user.getEmail(),
                                    null,
                                    List.of(authority)
                            );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );
                }
            }

        } catch (Exception exception) {

            // Invalid/expired JWT
            // Do not authenticate the request
        }

        filterChain.doFilter(request, response);
    }
}