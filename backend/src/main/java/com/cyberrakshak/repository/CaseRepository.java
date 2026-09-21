package com.cyberrakshak.repository;

import com.cyberrakshak.model.Case;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CaseRepository extends MongoRepository<Case, String> {
    Optional<Case> findByCaseId(String caseId);
    Optional<Case> findByIncidentId(String incidentId);
    List<Case> findByUserIdOrderByCreatedAtDesc(String userId);
    Page<Case> findByUserId(String userId, Pageable pageable);
    List<Case> findByAssignedOfficerId(String officerId);
    List<Case> findByStatus(String status);
    List<Case> findByPriority(String priority);
    List<Case> findTop10ByOrderByCreatedAtDesc();
}
