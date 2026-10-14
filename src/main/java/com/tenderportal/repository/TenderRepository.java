package com.tenderportal.repository;

import com.tenderportal.model.Tender;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TenderRepository extends JpaRepository<Tender, Long> {
    List<Tender> findByStatus(Tender.Status status);
    Optional<Tender> findByReferenceCode(String referenceCode);
    long countByStatus(Tender.Status status);
}
