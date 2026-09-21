package com.cyberrakshak.service;

import com.cyberrakshak.model.AuditLog;
import com.cyberrakshak.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Async
    public void logAction(String actorId, String actorEmail, String actorRole,
                          String action, String resource, String resourceId,
                          String previousValue, String newValue, String details, String ipAddress) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .actorId(actorId)
                    .actorEmail(actorEmail)
                    .actorRole(actorRole)
                    .action(action)
                    .resource(resource)
                    .resourceId(resourceId)
                    .previousValue(previousValue)
                    .newValue(newValue)
                    .details(details)
                    .ipAddress(ipAddress != null ? ipAddress : "127.0.0.1")
                    .timestamp(LocalDateTime.now())
                    .build();

            auditLogRepository.save(auditLog);
            log.info("Audit logged: {} by {} on resource {}", action, actorEmail, resourceId);
        } catch (Exception e) {
            log.error("Failed to persist audit log: {}", e.getMessage());
        }
    }
}
