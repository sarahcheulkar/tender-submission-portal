package com.tenderportal.controller;

import com.tenderportal.model.Tender;
import com.tenderportal.repository.TenderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tenders")
public class TenderController {

    @Autowired
    private TenderRepository tenderRepository;

    @GetMapping
    public ResponseEntity<List<Tender>> getAllTenders() {
        return ResponseEntity.ok(tenderRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTenderById(@PathVariable Long id) {
        return tenderRepository.findById(id)
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Tender> createTender(@RequestBody Tender tender) {
        if (tender.getReferenceCode() == null || tender.getReferenceCode().isEmpty()) {
            tender.setReferenceCode("TND-" + (System.currentTimeMillis() % 100000));
        }
        return ResponseEntity.ok(tenderRepository.save(tender));
    }
}
