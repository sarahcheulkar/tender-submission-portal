package com.tenderportal.controller;

import com.tenderportal.config.UserContext;
import com.tenderportal.dto.ReviewRequest;
import com.tenderportal.dto.SubmissionRequest;
import com.tenderportal.dto.SubmissionResponse;
import com.tenderportal.model.Review;
import com.tenderportal.model.Submission;
import com.tenderportal.model.Tender;
import com.tenderportal.model.User;
import com.tenderportal.repository.ReviewRepository;
import com.tenderportal.repository.SubmissionRepository;
import com.tenderportal.repository.TenderRepository;
import com.tenderportal.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private TenderRepository tenderRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<SubmissionResponse>> getAllSubmissions() {
        return ResponseEntity.ok(submissionRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<SubmissionResponse>> getMySubmissions() {
        User user = UserContext.getUser();
        if (user == null) {
            user = userRepository.findByEmail("applicant@example.com").orElse(null);
        }
        if (user == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(submissionRepository.findByApplicantId(user.getId()).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmissionById(@PathVariable Long id) {
        return submissionRepository.findById(id)
            .<ResponseEntity<?>>map(s -> ResponseEntity.ok(mapToResponse(s)))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Submission #" + id + " not found.")));
    }

    @PostMapping
    public ResponseEntity<?> createSubmission(@Valid @RequestBody SubmissionRequest req) {
        User user = UserContext.getUser();
        if (user == null) {
            user = userRepository.findByEmail("applicant@example.com").orElse(null);
        }
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Valid applicant profile required."));
        }

        if (req.getBidAmount() == null || req.getBidAmount() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bid amount must be a positive number."));
        }

        Optional<Tender> tenderOpt = tenderRepository.findById(req.getTenderId());
        if (tenderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Specified tender does not exist."));
        }

        Tender tender = tenderOpt.get();
        if (tender.getStatus() != Tender.Status.OPEN) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Selected tender is closed for bidding."));
        }

        if (submissionRepository.existsByApplicantIdAndTenderId(user.getId(), tender.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Duplicate submission: You have already submitted a bid for this tender."));
        }

        Submission submission = new Submission();
        submission.setSubmissionCode("SUB-" + (1000 + submissionRepository.count() + 1));
        submission.setTender(tender);
        submission.setApplicant(user);
        submission.setBidAmount(req.getBidAmount());
        submission.setTechnicalDescription(req.getTechnicalDescription());
        submission.setDocumentReference(req.getDocumentReference() != null && !req.getDocumentReference().isEmpty() ?
            req.getDocumentReference() : "DOC-" + System.currentTimeMillis() + ".pdf");
        submission.setStatus(Submission.Status.SUBMITTED);
        submission.setSubmittedAt(LocalDateTime.now());

        Submission saved = submissionRepository.save(submission);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(saved));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveSubmission(@PathVariable Long id, @RequestBody(required = false) ReviewRequest req) {
        return processReview(id, Submission.Status.APPROVED, req != null ? req.getComments() : "Approved by evaluator.");
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectSubmission(@PathVariable Long id, @RequestBody(required = false) ReviewRequest req) {
        String reason = (req != null && req.getComments() != null && !req.getComments().trim().isEmpty()) ?
            req.getComments() : "Proposal does not meet tender technical compliance requirements.";
        return processReview(id, Submission.Status.REJECTED, reason);
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<?> reviewSubmission(@PathVariable Long id, @Valid @RequestBody ReviewRequest req) {
        try {
            Submission.Status newStatus = Submission.Status.valueOf(req.getAction().toUpperCase());
            return processReview(id, newStatus, req.getComments());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status action: " + req.getAction()));
        }
    }

    private ResponseEntity<?> processReview(Long id, Submission.Status newStatus, String comments) {
        Optional<Submission> opt = submissionRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Submission #" + id + " not found."));
        }

        Submission submission = opt.get();
        User reviewer = UserContext.getUser();
        if (reviewer == null) {
            reviewer = userRepository.findByEmail("admin@example.com").orElse(null);
        }

        submission.setStatus(newStatus);
        submission.setReviewedAt(LocalDateTime.now());
        if (newStatus == Submission.Status.REJECTED) {
            submission.setRejectionReason(comments);
        }
        submissionRepository.save(submission);

        Review review = new Review();
        review.setSubmission(submission);
        review.setReviewer(reviewer);
        review.setAction(Review.Action.valueOf(newStatus.name()));
        review.setComments(comments);
        reviewRepository.save(review);

        return ResponseEntity.ok(mapToResponse(submission));
    }

    private SubmissionResponse mapToResponse(Submission s) {
        return new SubmissionResponse(
            s.getId(),
            s.getSubmissionCode(),
            s.getTender().getId(),
            s.getTender().getTitle(),
            s.getTender().getReferenceCode(),
            s.getTender().getDepartment(),
            s.getTender().getEstimatedValue(),
            s.getApplicant().getId(),
            s.getApplicant().getName(),
            s.getApplicant().getEmail(),
            s.getApplicant().getOrganization(),
            s.getBidAmount(),
            s.getTechnicalDescription(),
            s.getDocumentReference(),
            s.getStatus().name(),
            s.getSubmittedAt(),
            s.getReviewedAt(),
            s.getRejectionReason()
        );
    }
}
