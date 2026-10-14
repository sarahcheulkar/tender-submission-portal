package com.tenderportal.controller;

import com.tenderportal.config.UserContext;
import com.tenderportal.dto.ReviewRequest;
import com.tenderportal.dto.SubmissionRequest;
import com.tenderportal.dto.SubmissionResponse;
import com.tenderportal.model.Submission;
import com.tenderportal.model.User;
import com.tenderportal.repository.UserRepository;
import com.tenderportal.service.TenderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private TenderService tenderService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<SubmissionResponse>> getAllSubmissions() {
        return ResponseEntity.ok(tenderService.getAllSubmissions());
    }

    @GetMapping("/my")
    public ResponseEntity<List<SubmissionResponse>> getMySubmissions() {
        User user = getCurrentOrFallbackUser();
        if (user == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(tenderService.getSubmissionsByApplicant(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmissionById(@PathVariable Long id) {
        return tenderService.getSubmissionById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Submission #" + id + " not found.")));
    }

    @PostMapping
    public ResponseEntity<?> createSubmission(@Valid @RequestBody SubmissionRequest req) {
        User user = null;
        if (req.getApplicantEmail() != null && !req.getApplicantEmail().trim().isEmpty()) {
            String email = req.getApplicantEmail().trim();
            user = userRepository.findByEmail(email).orElseGet(() -> {
                User u = new User();
                u.setEmail(email);
                u.setName(req.getApplicantName() != null && !req.getApplicantName().trim().isEmpty() ? 
                        req.getApplicantName().trim() : "Applicant");
                u.setOrganization(req.getOrganization() != null && !req.getOrganization().trim().isEmpty() ? 
                        req.getOrganization().trim() : "Enterprise Vendor");
                u.setRole(User.Role.APPLICANT);
                u.setPassword("password");
                return userRepository.save(u);
            });
        }
        if (user == null) {
            user = getCurrentOrFallbackUser();
        }
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Valid applicant profile required."));
        }

        try {
            SubmissionResponse response = tenderService.createSubmission(req, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveSubmission(@PathVariable Long id, @RequestBody(required = false) ReviewRequest req) {
        User reviewer = getCurrentOrFallbackReviewer();
        String comments = (req != null && req.getComments() != null) ? req.getComments() : "Approved by evaluator.";
        try {
            return ResponseEntity.ok(tenderService.approveSubmission(id, reviewer, comments));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectSubmission(@PathVariable Long id, @RequestBody(required = false) ReviewRequest req) {
        User reviewer = getCurrentOrFallbackReviewer();
        String reason = (req != null && req.getComments() != null && !req.getComments().trim().isEmpty()) ?
                req.getComments() : "Proposal does not meet tender technical compliance requirements.";
        try {
            return ResponseEntity.ok(tenderService.rejectSubmission(id, reviewer, reason));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<?> reviewSubmission(@PathVariable Long id, @Valid @RequestBody ReviewRequest req) {
        User reviewer = getCurrentOrFallbackReviewer();
        try {
            Submission.Status status = Submission.Status.valueOf(req.getAction().toUpperCase());
            return ResponseEntity.ok(tenderService.evaluateSubmission(id, status, reviewer, req.getComments()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid review status action: " + req.getAction()));
        }
    }

    private User getCurrentOrFallbackUser() {
        User user = UserContext.getUser();
        if (user == null) {
            user = userRepository.findByEmail("applicant@example.com").orElse(null);
        }
        return user;
    }

    private User getCurrentOrFallbackReviewer() {
        User user = UserContext.getUser();
        if (user == null) {
            user = userRepository.findByEmail("admin@example.com").orElse(null);
        }
        return user;
    }
}
