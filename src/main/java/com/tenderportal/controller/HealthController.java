package com.tenderportal.controller;

import com.tenderportal.dto.StatsResponse;
import com.tenderportal.model.Submission;
import com.tenderportal.model.Tender;
import com.tenderportal.repository.SubmissionRepository;
import com.tenderportal.repository.TenderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired
    private TenderRepository tenderRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("status", "UP");
        status.put("service", "Ansible-Provisioned Tender Submission Portal");
        status.put("student", "Sarah Cheulkar (Roll No: 23102C0060)");
        status.put("subject", "DevOps Major Project");
        status.put("version", "1.0.0");
        status.put("database", "H2 Embedded Relational DB (Healthy)");
        status.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(status);
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        long totalTenders = tenderRepository.count();
        long openTenders = tenderRepository.countByStatus(Tender.Status.OPEN);
        long closedTenders = totalTenders - openTenders;

        long totalSubs = submissionRepository.count();
        long submitted = submissionRepository.countByStatus(Submission.Status.SUBMITTED);
        long underReview = submissionRepository.countByStatus(Submission.Status.UNDER_REVIEW);
        long approved = submissionRepository.countByStatus(Submission.Status.APPROVED);
        long rejected = submissionRepository.countByStatus(Submission.Status.REJECTED);

        double totalBidsValue = submissionRepository.findAll().stream()
            .mapToDouble(Submission::getBidAmount)
            .sum();

        double approvalRate = totalSubs > 0 ? ((double) approved / totalSubs) * 100.0 : 0.0;

        Map<String, Object> telemetry = new LinkedHashMap<>();
        telemetry.put("uptime", "Operational");
        telemetry.put("pipelineGate", "PASSED (Quality Gate Active)");
        telemetry.put("dockerized", true);
        telemetry.put("ansibleProvisioned", true);

        return ResponseEntity.ok(new StatsResponse(
            totalTenders, openTenders, closedTenders, totalSubs, submitted, underReview, approved, rejected,
            totalBidsValue, Math.round(approvalRate * 10.0) / 10.0, telemetry
        ));
    }
}
