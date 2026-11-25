
package restaurant_backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import restaurant_backend.security.JwtAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .cors(cors -> {
                })
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/ws", "/ws/**").permitAll()
                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login",
                                "/uploads/menu/**"
                        ).permitAll()

                        // Public menu browsing
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/menu/items/available",
                                "/api/menu/items/category/**"
                        ).permitAll()

                        // Public table selection and QR lookup
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/tables",
                                "/api/tables/qr/**"
                        ).permitAll()

                        // Public table session initialization
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/sessions/table/*/start"
                        ).permitAll()

                        // Role-specific endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/kitchen/**").hasRole("KITCHEN")
                        .requestMatchers("/api/waiter/**").hasRole("WAITER")
                        .requestMatchers("/api/cashier/**").hasRole("CASHIER")

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}

