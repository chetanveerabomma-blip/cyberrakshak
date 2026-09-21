package com.cyberrakshak.repository;

import com.cyberrakshak.model.Incident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentRepository extends MongoRepository<Incident, String> {
    Optional<Incident> findByIncidentId(String incidentId);
    List<Incident> findByUserIdOrderByCreatedAtDesc(String userId);
    Page<Incident> findByUserId(String userId, Pageable pageable);
    List<Incident> findByCategory(String category);
    List<Incident> findByRiskLevel(String riskLevel);
    List<Incident> findTop15ByOrderByCreatedAtDesc();
}
