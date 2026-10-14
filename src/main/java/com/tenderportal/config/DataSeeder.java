package com.tenderportal.config;

import com.tenderportal.model.Review;
import com.tenderportal.model.Submission;
import com.tenderportal.model.Tender;
import com.tenderportal.model.User;
import com.tenderportal.repository.ReviewRepository;
import com.tenderportal.repository.SubmissionRepository;
import com.tenderportal.repository.TenderRepository;
import com.tenderportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TenderRepository tenderRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private TokenService tokenService;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // 1. Seed Users
            User reviewer = new User(
                "Sarah Cheulkar (Reviewer)", "admin@example.com", "password",
                User.Role.REVIEWER, "+91 98200 12345", "Tender Evaluation Board"
            );
            User applicant1 = new User(
                "Apex InfraTech Solutions", "applicant@example.com", "password",
                User.Role.APPLICANT, "+91 98190 54321", "Apex Group Consortium"
            );
            User applicant2 = new User(
                "Quantum Cloud Dynamics", "quantum@example.com", "password",
                User.Role.APPLICANT, "+91 98330 98765", "Quantum Global Corp"
            );
            User applicant3 = new User(
                "CyberShield Innovations", "cybershield@example.com", "password",
                User.Role.APPLICANT, "+91 98765 43210", "CyberShield Defense Labs"
            );

            userRepository.save(reviewer);
            userRepository.save(applicant1);
            userRepository.save(applicant2);
            userRepository.save(applicant3);

            tokenService.registerStaticToken("demo-reviewer-token", reviewer);
            tokenService.registerStaticToken("demo-applicant-token", applicant1);

            // 2. Seed Tenders
            Tender t1 = new Tender(
                "TND-2026-081",
                "Metro Line Smart Ticketing & Cloud AFC Infrastructure",
                "Design, deployment and operational maintenance of cloud automated fare collection (AFC) gates, QR-code validation readers, and real-time transaction processing clusters.",
                "Urban Transportation Authority",
                "Smart Transit",
                2400000.0,
                LocalDateTime.now().minusDays(10),
                LocalDateTime.now().plusDays(25),
                Tender.Status.OPEN
            );

            Tender t2 = new Tender(
                "TND-2026-104",
                "High-Speed Optical Fiber Campus Network Modernization",
                "Turnkey passive & active optical network deployment, resilient multi-gigabit routing core, and redundant edge switching across academic campus facilities.",
                "Higher Education Directorate",
                "Telecommunications",
                850000.0,
                LocalDateTime.now().minusDays(7),
                LocalDateTime.now().plusDays(18),
                Tender.Status.OPEN
            );

            Tender t3 = new Tender(
                "TND-2026-142",
                "Enterprise Zero-Trust Cybersecurity Audit & SIEM Operations",
                "Comprehensive vulnerability assessment, automated penetration testing, SOC monitoring integration, and ISO/IEC 27001 regulatory compliance verification.",
                "National Cyber Defense Agency",
                "Information Security",
                420000.0,
                LocalDateTime.now().minusDays(5),
                LocalDateTime.now().plusDays(12),
                Tender.Status.OPEN
            );

            Tender t4 = new Tender(
                "TND-2026-199",
                "AI-Powered Smart Grid Energy Metering System",
                "Advanced AMI smart metering deployment with edge telemetry, automated peak-load balancing, and secure predictive fault analytics.",
                "State Power Distribution Corp",
                "Energy & Utilities",
                1150000.0,
                LocalDateTime.now().minusDays(30),
                LocalDateTime.now().minusDays(2),
                Tender.Status.CLOSED
            );

            tenderRepository.save(t1);
            tenderRepository.save(t2);
            tenderRepository.save(t3);
            tenderRepository.save(t4);

            // 3. Seed Submissions across different lifecycle states
            Submission s1 = new Submission();
            s1.setSubmissionCode("SUB-2026-001");
            s1.setTender(t1);
            s1.setApplicant(applicant1);
            s1.setBidAmount(2280000.0);
            s1.setTechnicalDescription("Proposed redundant microservices AFC gateway built on Kubernetes with zero-downtime rolling upgrades and offline biometric failover.");
            s1.setDocumentReference("DOC-APEX-TRANSIT-V2.pdf");
            s1.setStatus(Submission.Status.APPROVED);
            s1.setSubmittedAt(LocalDateTime.now().minusDays(4));
            s1.setReviewedAt(LocalDateTime.now().minusDays(1));
            submissionRepository.save(s1);

            Review r1 = new Review();
            r1.setSubmission(s1);
            r1.setReviewer(reviewer);
            r1.setAction(Review.Action.APPROVED);
            r1.setComments("Architectural design meets all SLA requirements. Financial bid is 5% under estimated ceiling.");
            reviewRepository.save(r1);

            Submission s2 = new Submission();
            s2.setSubmissionCode("SUB-2026-002");
            s2.setTender(t2);
            s2.setApplicant(applicant2);
            s2.setBidAmount(795000.0);
            s2.setTechnicalDescription("Dense Wavelength Division Multiplexing (DWDM) optical backbone with 99.999% uptime guarantee and 24/7 dedicated NOC support.");
            s2.setDocumentReference("DOC-QUANTUM-FIBER-TECH.pdf");
            s2.setStatus(Submission.Status.UNDER_REVIEW);
            s2.setSubmittedAt(LocalDateTime.now().minusDays(2));
            submissionRepository.save(s2);

            Submission s3 = new Submission();
            s3.setSubmissionCode("SUB-2026-003");
            s3.setTender(t3);
            s3.setApplicant(applicant3);
            s3.setBidAmount(385000.0);
            s3.setTechnicalDescription("Automated continuous threat exposure management (CTEM) platform with deep-packet inspection and machine-learning threat correlation.");
            s3.setDocumentReference("DOC-CYBERSHIELD-SIEM.pdf");
            s3.setStatus(Submission.Status.SUBMITTED);
            s3.setSubmittedAt(LocalDateTime.now().minusHours(6));
            submissionRepository.save(s3);

            Submission s4 = new Submission();
            s4.setSubmissionCode("SUB-2026-004");
            s4.setTender(t1);
            s4.setApplicant(applicant2);
            s4.setBidAmount(3100000.0);
            s4.setTechnicalDescription("Proprietary monolithic ticketing hardware package.");
            s4.setDocumentReference("DOC-QUANTUM-LEGACY.pdf");
            s4.setStatus(Submission.Status.REJECTED);
            s4.setSubmittedAt(LocalDateTime.now().minusDays(5));
            s4.setReviewedAt(LocalDateTime.now().minusDays(2));
            s4.setRejectionReason("Bid amount ($3,100,000) exceeds maximum authorized budget of $2,400,000. Proprietary hardware fails vendor neutrality standards.");
            submissionRepository.save(s4);

            Review r4 = new Review();
            r4.setSubmission(s4);
            r4.setReviewer(reviewer);
            r4.setAction(Review.Action.REJECTED);
            r4.setComments(s4.getRejectionReason());
            reviewRepository.save(r4);
        }
    }
}
