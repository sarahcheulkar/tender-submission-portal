package com.tenderportal.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SubmissionRequest {
    @NotNull(message = "Tender ID is required")
    private Long tenderId;

    @NotNull(message = "Bid amount is required")
    @Min(value = 1, message = "Bid amount must be positive")
    private Double bidAmount;

    @NotBlank(message = "Technical proposal/description is required")
    private String technicalDescription;

    private String documentReference;
    private String applicantName;
    private String applicantEmail;
    private String organization;

    public Long getTenderId() { return tenderId; }
    public void setTenderId(Long tenderId) { this.tenderId = tenderId; }
    public Double getBidAmount() { return bidAmount; }
    public void setBidAmount(Double bidAmount) { this.bidAmount = bidAmount; }
    public String getTechnicalDescription() { return technicalDescription; }
    public void setTechnicalDescription(String technicalDescription) { this.technicalDescription = technicalDescription; }
    public String getDocumentReference() { return documentReference; }
    public void setDocumentReference(String documentReference) { this.documentReference = documentReference; }

    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }
    public String getApplicantEmail() { return applicantEmail; }
    public void setApplicantEmail(String applicantEmail) { this.applicantEmail = applicantEmail; }
    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }
}
