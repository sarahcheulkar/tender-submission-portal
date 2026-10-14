package com.tenderportal.dto;

import java.time.LocalDateTime;

public class SubmissionResponse {
    private Long id;
    private String submissionCode;
    private Long tenderId;
    private String tenderTitle;
    private String tenderReferenceCode;
    private String department;
    private Double estimatedValue;
    private Long applicantId;
    private String applicantName;
    private String applicantEmail;
    private String organization;
    private Double bidAmount;
    private String technicalDescription;
    private String documentReference;
    private String status;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private String rejectionReason;

    public SubmissionResponse() {}

    public SubmissionResponse(Long id, String submissionCode, Long tenderId, String tenderTitle, String tenderReferenceCode,
                              String department, Double estimatedValue, Long applicantId, String applicantName,
                              String applicantEmail, String organization, Double bidAmount, String technicalDescription,
                              String documentReference, String status, LocalDateTime submittedAt, LocalDateTime reviewedAt,
                              String rejectionReason) {
        this.id = id;
        this.submissionCode = submissionCode;
        this.tenderId = tenderId;
        this.tenderTitle = tenderTitle;
        this.tenderReferenceCode = tenderReferenceCode;
        this.department = department;
        this.estimatedValue = estimatedValue;
        this.applicantId = applicantId;
        this.applicantName = applicantName;
        this.applicantEmail = applicantEmail;
        this.organization = organization;
        this.bidAmount = bidAmount;
        this.technicalDescription = technicalDescription;
        this.documentReference = documentReference;
        this.status = status;
        this.submittedAt = submittedAt;
        this.reviewedAt = reviewedAt;
        this.rejectionReason = rejectionReason;
    }

    public Long getId() { return id; }
    public String getSubmissionCode() { return submissionCode; }
    public Long getTenderId() { return tenderId; }
    public String getTenderTitle() { return tenderTitle; }
    public String getTenderReferenceCode() { return tenderReferenceCode; }
    public String getDepartment() { return department; }
    public Double getEstimatedValue() { return estimatedValue; }
    public Long getApplicantId() { return applicantId; }
    public String getApplicantName() { return applicantName; }
    public String getApplicantEmail() { return applicantEmail; }
    public String getOrganization() { return organization; }
    public Double getBidAmount() { return bidAmount; }
    public String getTechnicalDescription() { return technicalDescription; }
    public String getDocumentReference() { return documentReference; }
    public String getStatus() { return status; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public String getRejectionReason() { return rejectionReason; }
}
