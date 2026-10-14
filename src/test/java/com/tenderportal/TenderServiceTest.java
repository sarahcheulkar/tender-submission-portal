package com.tenderportal;

import com.tenderportal.controller.SubmissionController;
import com.tenderportal.dto.ReviewRequest;
import com.tenderportal.dto.SubmissionRequest;
import com.tenderportal.model.Submission;
import com.tenderportal.model.Tender;
import com.tenderportal.repository.SubmissionRepository;
import com.tenderportal.repository.TenderRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class TenderServiceTest {

    @Autowired
    private SubmissionController submissionController;

    @Autowired
    private TenderRepository tenderRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Test
    void testTenderRetrieval() {
        var tenders = tenderRepository.findAll();
        assertFalse(tenders.isEmpty(), "Tenders catalog should contain pre-seeded data");
    }

    @Test
    void testInvalidBidAmountRejection() {
        SubmissionRequest req = new SubmissionRequest();
        req.setTenderId(1L);
        req.setBidAmount(-500.0);
        req.setTechnicalDescription("Invalid test bid");

        ResponseEntity<?> response = submissionController.createSubmission(req);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void testReviewerApprovalWorkflow() {
        var subs = submissionRepository.findAll();
        assertFalse(subs.isEmpty());
        Submission target = subs.get(0);

        ReviewRequest req = new ReviewRequest();
        req.setAction("APPROVED");
        req.setComments("Technical architecture and compliance cleared.");

        ResponseEntity<?> response = submissionController.approveSubmission(target.getId(), req);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testReviewerRejectionWorkflow() {
        var subs = submissionRepository.findAll();
        assertFalse(subs.isEmpty());
        Submission target = subs.get(subs.size() - 1);

        ReviewRequest req = new ReviewRequest();
        req.setAction("REJECTED");
        req.setComments("Bid exceeds allocated budget limit.");

        ResponseEntity<?> response = submissionController.rejectSubmission(target.getId(), req);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
