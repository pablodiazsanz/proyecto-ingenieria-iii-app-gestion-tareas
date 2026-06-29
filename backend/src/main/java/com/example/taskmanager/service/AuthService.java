package com.example.taskmanager.service;

import com.example.taskmanager.dto.auth.AuthResponse;
import com.example.taskmanager.dto.auth.LoginRequest;
import com.example.taskmanager.dto.auth.RegisterRequest;
import com.example.taskmanager.model.Role;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final AuditLogService auditLogService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("El email ya esta registrado");
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("El username ya esta en uso");
        }

        User user = userRepository.save(User.builder()
                .username(request.username())
                .email(request.email().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build());

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);
        auditLogService.log(user, "REGISTER", "USER:" + user.getId());
        return buildResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password())
        );

        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);
        auditLogService.log(user, "LOGIN", "USER:" + user.getId());
        return buildResponse(user, token);
    }

    private AuthResponse buildResponse(User user, String token) {
        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
