package com.tenderportal.repository;

import com.tenderportal.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByApplicantId(Long applicantId);
    List<Submission> findByTenderId(Long tenderId);
    List<Submission> findByStatus(Submission.Status status);
    boolean existsByApplicantIdAndTenderId(Long applicantId, Long tenderId);
    Optional<Submission> findBySubmissionCode(String submissionCode);
    long countByStatus(Submission.Status status);
}
