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

    public Long getTenderId() { return tenderId; }
    public void setTenderId(Long tenderId) { this.tenderId = tenderId; }
    public Double getBidAmount() { return bidAmount; }
    public void setBidAmount(Double bidAmount) { this.bidAmount = bidAmount; }
    public String getTechnicalDescription() { return technicalDescription; }
    public void setTechnicalDescription(String technicalDescription) { this.technicalDescription = technicalDescription; }
    public String getDocumentReference() { return documentReference; }
    public void setDocumentReference(String documentReference) { this.documentReference = documentReference; }
}
