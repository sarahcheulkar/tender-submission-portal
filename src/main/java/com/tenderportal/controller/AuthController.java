package com.tenderportal.controller;

import com.tenderportal.config.TokenService;
import com.tenderportal.config.UserContext;
import com.tenderportal.dto.AuthRequest;
import com.tenderportal.dto.AuthResponse;
import com.tenderportal.model.User;
import com.tenderportal.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(request.getPassword())) {
                String token = tokenService.generateToken(user);
                return ResponseEntity.ok(new AuthResponse(
                    token, user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getOrganization()
                ));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("error", "Invalid email or password. Please verify credentials."));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty() ||
            user.getPassword() == null || user.getPassword().trim().isEmpty() ||
            user.getName() == null || user.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name, email, and password are required."));
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "An account with email " + user.getEmail() + " already exists."));
        }

        if (user.getRole() == null) {
            user.setRole(User.Role.APPLICANT);
        }
        userRepository.save(user);

        String token = tokenService.generateToken(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(
            token, user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getOrganization()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        User user = UserContext.getUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }
        return ResponseEntity.ok(new AuthResponse(
            null, user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getOrganization()
        ));
    }
}
