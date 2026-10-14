package com.tenderportal.dto;

import java.util.Map;

public class StatsResponse {
    private long totalTenders;
    private long openTenders;
    private long closedTenders;
    private long totalSubmissions;
    private long submitted;
    private long underReview;
    private long approved;
    private long rejected;
    private double totalBidsValue;
    private double approvalRate;
    private Map<String, Object> systemTelemetry;

    public StatsResponse() {}

    public StatsResponse(long totalTenders, long openTenders, long closedTenders, long totalSubmissions,
                         long submitted, long underReview, long approved, long rejected,
                         double totalBidsValue, double approvalRate, Map<String, Object> systemTelemetry) {
        this.totalTenders = totalTenders;
        this.openTenders = openTenders;
        this.closedTenders = closedTenders;
        this.totalSubmissions = totalSubmissions;
        this.submitted = submitted;
        this.underReview = underReview;
        this.approved = approved;
        this.rejected = rejected;
        this.totalBidsValue = totalBidsValue;
        this.approvalRate = approvalRate;
        this.systemTelemetry = systemTelemetry;
    }

    public long getTotalTenders() { return totalTenders; }
    public long getOpenTenders() { return openTenders; }
    public long getClosedTenders() { return closedTenders; }
    public long getTotalSubmissions() { return totalSubmissions; }
    public long getSubmitted() { return submitted; }
    public long getUnderReview() { return underReview; }
    public long getApproved() { return approved; }
    public long getRejected() { return rejected; }
    public double getTotalBidsValue() { return totalBidsValue; }
    public double getApprovalRate() { return approvalRate; }
    public Map<String, Object> getSystemTelemetry() { return systemTelemetry; }
}
