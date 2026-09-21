package com.cyberrakshak.repository;

import com.cyberrakshak.model.Evidence;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvidenceRepository extends MongoRepository<Evidence, String> {
    Optional<Evidence> findByEvidenceId(String evidenceId);
    List<Evidence> findByIncidentId(String incidentId);
    List<Evidence> findByCaseId(String caseId);
    List<Evidence> findByUploadedBy(String uploadedBy);
}
