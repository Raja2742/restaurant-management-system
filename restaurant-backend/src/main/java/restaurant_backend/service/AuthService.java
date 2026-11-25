package restaurant_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import restaurant_backend.dto.auth.AuthResponse;
import restaurant_backend.dto.auth.LoginRequest;
import restaurant_backend.dto.auth.RegisterRequest;
import restaurant_backend.entity.Role;
import restaurant_backend.entity.User;
import restaurant_backend.exception.ConflictException;
import restaurant_backend.exception.InvalidCredentialsException;
import restaurant_backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException(
                    "Email already registered"
            );
        }

        User user = new User();

        user.setName(request.name());
        user.setEmail(request.email());
        user.setPhone(request.phone());

        user.setPassword(
                passwordEncoder.encode(
                        request.password()
                )
        );

        user.setRole(Role.CUSTOMER);

        User savedUser =
                userRepository.save(user);

        String token =
                jwtService.generateToken(savedUser);

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest request) {

        User user =
                userRepository
                        .findByEmail(request.email())
                        .orElseThrow(() ->
                                new InvalidCredentialsException(
                                        "Invalid email or password"
                                )
                        );

        if (!passwordEncoder.matches(
                request.password(),
                user.getPassword()
        )) {

            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }

        String token =
                jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}