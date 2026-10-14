package com.tenderportal.service;

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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TenderService {

    private final TenderRepository tenderRepository;
    private final SubmissionRepository submissionRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public TenderService(TenderRepository tenderRepository,
                         SubmissionRepository submissionRepository,
                         ReviewRepository reviewRepository,
                         UserRepository userRepository) {
        this.tenderRepository = tenderRepository;
        this.submissionRepository = submissionRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    public List<Tender> getAllTenders() {
        return tenderRepository.findAll();
    }

    public Optional<Tender> getTenderById(Long id) {
        return tenderRepository.findById(id);
    }

    public List<SubmissionResponse> getAllSubmissions() {
        return submissionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SubmissionResponse> getSubmissionsByApplicant(Long applicantId) {
        return submissionRepository.findByApplicantId(applicantId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Optional<SubmissionResponse> getSubmissionById(Long id) {
        return submissionRepository.findById(id).map(this::mapToResponse);
    }

    @Transactional
    public SubmissionResponse createSubmission(SubmissionRequest req, User applicant) {
        if (req.getBidAmount() == null || req.getBidAmount() <= 0) {
            throw new IllegalArgumentException("Bid amount must be a positive number.");
        }
        if (req.getTechnicalDescription() == null || req.getTechnicalDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Technical proposal description is required.");
        }

        Tender tender = tenderRepository.findById(req.getTenderId())
                .orElseThrow(() -> new IllegalArgumentException("Target tender does not exist."));

        if (tender.getStatus() != Tender.Status.OPEN) {
            throw new IllegalStateException("Selected tender is closed for bidding.");
        }

        if (submissionRepository.existsByApplicantIdAndTenderId(applicant.getId(), tender.getId())) {
            throw new IllegalStateException("Duplicate submission: An active bid already exists for this tender.");
        }

        Submission submission = new Submission();
        submission.setSubmissionCode("SUB-" + (1000 + submissionRepository.count() + 1));
        submission.setTender(tender);
        submission.setApplicant(applicant);
        submission.setBidAmount(req.getBidAmount());
        submission.setTechnicalDescription(req.getTechnicalDescription());
        submission.setDocumentReference(req.getDocumentReference() != null && !req.getDocumentReference().isEmpty() ?
                req.getDocumentReference() : "DOC-" + System.currentTimeMillis() + ".pdf");
        submission.setStatus(Submission.Status.SUBMITTED);
        submission.setSubmittedAt(LocalDateTime.now());

        Submission saved = submissionRepository.save(submission);
        return mapToResponse(saved);
    }

    @Transactional
    public SubmissionResponse approveSubmission(Long id, User reviewer, String comments) {
        return evaluateSubmission(id, Submission.Status.APPROVED, reviewer, comments != null ? comments : "Approved by evaluator.");
    }

    @Transactional
    public SubmissionResponse rejectSubmission(Long id, User reviewer, String reason) {
        if (reason == null || reason.trim().isEmpty()) {
            reason = "Proposal does not meet tender technical compliance requirements.";
        }
        return evaluateSubmission(id, Submission.Status.REJECTED, reviewer, reason);
    }

    @Transactional
    public SubmissionResponse evaluateSubmission(Long id, Submission.Status newStatus, User reviewer, String feedback) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Submission #" + id + " not found."));

        submission.setStatus(newStatus);
        submission.setReviewedAt(LocalDateTime.now());
        if (newStatus == Submission.Status.REJECTED) {
            submission.setRejectionReason(feedback);
        }
        submissionRepository.save(submission);

        Review review = new Review();
        review.setSubmission(submission);
        review.setReviewer(reviewer);
        review.setAction(Review.Action.valueOf(newStatus.name()));
        review.setComments(feedback);
        reviewRepository.save(review);

        return mapToResponse(submission);
    }

    public SubmissionResponse mapToResponse(Submission s) {
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
