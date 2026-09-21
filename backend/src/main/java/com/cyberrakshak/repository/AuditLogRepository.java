package com.cyberrakshak.repository;

import com.cyberrakshak.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    List<AuditLog> findTop50ByOrderByTimestampDesc();
    Page<AuditLog> findAllByOrderByTimestampDesc(Pageable pageable);
    List<AuditLog> findByResourceIdOrderByTimestampDesc(String resourceId);
    List<AuditLog> findByActorEmailOrderByTimestampDesc(String actorEmail);
}
