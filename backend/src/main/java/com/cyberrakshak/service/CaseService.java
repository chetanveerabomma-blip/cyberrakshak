package com.cyberrakshak.service;

import com.cyberrakshak.dto.AssignCaseRequest;
import com.cyberrakshak.dto.CaseNoteRequest;
import com.cyberrakshak.dto.CaseStatusUpdateRequest;
import com.cyberrakshak.model.Case;
import com.cyberrakshak.model.CaseTimelineEvent;
import com.cyberrakshak.repository.CaseRepository;
import com.cyberrakshak.repository.IncidentRepository;
import com.cyberrakshak.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CaseService {

    private static final Logger log = LoggerFactory.getLogger(CaseService.class);

    private final CaseRepository caseRepository;
    private final IncidentRepository incidentRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public CaseService(CaseRepository caseRepository,
                       IncidentRepository incidentRepository,
                       NotificationService notificationService,
                       AuditLogService auditLogService) {
        this.caseRepository = caseRepository;
        this.incidentRepository = incidentRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    public List<Case> getUserCases(String userId) {
        return caseRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Case> getAllCases() {
        return caseRepository.findAll();
    }

    public Case getCaseById(String caseId) {
        return caseRepository.findByCaseId(caseId)
                .or(() -> caseRepository.findById(caseId))
                .orElseThrow(() -> new RuntimeException("Case not found: " + caseId));
    }

    public Case trackCasePublic(String caseId, String email) {
        Case c = caseRepository.findByCaseId(caseId)
                .orElseThrow(() -> new RuntimeException("No case found with ID: " + caseId));

        if (email != null && !email.isBlank()) {
            if (!email.trim().equalsIgnoreCase(c.getComplainantEmail())) {
                throw new RuntimeException("Verification email does not match registered case complainant.");
            }
        }
        return c;
    }

    public Case updateCaseStatus(String caseId, CaseStatusUpdateRequest request, UserPrincipal officer) {
        Case c = getCaseById(caseId);
        String oldStatus = c.getStatus();
        c.setStatus(request.getStatus());
        c.setUpdatedAt(LocalDateTime.now());

        String stageTitle = (request.getStageTitle() != null && !request.getStageTitle().isBlank())
                ? request.getStageTitle() : "Status updated to " + request.getStatus();
        String description = (request.getNote() != null && !request.getNote().isBlank())
                ? request.getNote() : "Case transition to " + request.getStatus();

        CaseTimelineEvent event = CaseTimelineEvent.builder()
                .stage(request.getStatus())
                .title(stageTitle)
                .description(description)
                .updatedBy(officer.getName())
                .timestamp(LocalDateTime.now())
                .build();

        c.getTimeline().add(event);

        if (request.getNote() != null && !request.getNote().isBlank()) {
            c.getOfficerNotes().add("[" + officer.getName() + "]: " + request.getNote());
        }

        if ("RESOLVED".equalsIgnoreCase(request.getStatus())) {
            c.setResolutionSummary(description);
        }

        Case saved = caseRepository.save(c);

        incidentRepository.findByIncidentId(c.getIncidentId()).ifPresent(inc -> {
            inc.setStatus(request.getStatus());
            incidentRepository.save(inc);
        });

        notificationService.sendNotification(
                c.getUserId(),
                "Case Status Update: " + c.getCaseId(),
                "Your case status has progressed to " + request.getStatus() + ". Officer note: " + description,
                "CASE_UPDATED",
                c.getCaseId()
        );

        auditLogService.logAction(
                officer.getId(), officer.getEmail(), officer.getAuthorities().toString(),
                "ADMIN_UPDATED_CASE_STATUS", "CASE", c.getCaseId(),
                oldStatus, request.getStatus(), description, null
        );

        return saved;
    }

    public Case assignOfficer(String caseId, AssignCaseRequest request, UserPrincipal admin) {
        Case c = getCaseById(caseId);
        String oldOfficer = c.getAssignedOfficerName();
        c.setAssignedOfficerId(request.getOfficerId());
        c.setAssignedOfficerName(request.getOfficerName());
        if (request.getPriority() != null) {
            c.setPriority(request.getPriority());
        }
        if ("SUBMITTED".equalsIgnoreCase(c.getStatus())) {
            c.setStatus("ASSIGNED");
        }
        c.setUpdatedAt(LocalDateTime.now());

        c.getTimeline().add(CaseTimelineEvent.builder()
                .stage("ASSIGNED")
                .title("Case Assigned to Cyber Officer")
                .description("Assigned to Officer " + request.getOfficerName() + " for investigation.")
                .updatedBy(admin.getName())
                .timestamp(LocalDateTime.now())
                .build());

        Case saved = caseRepository.save(c);

        notificationService.sendNotification(
                c.getUserId(),
                "Officer Assigned to " + c.getCaseId(),
                "Your incident has been assigned to Cyber Officer " + request.getOfficerName() + ".",
                "CASE_UPDATED",
                c.getCaseId()
        );

        auditLogService.logAction(
                admin.getId(), admin.getEmail(), admin.getAuthorities().toString(),
                "ADMIN_ASSIGNED_CASE", "CASE", c.getCaseId(),
                oldOfficer, request.getOfficerName(), "Assigned case with priority " + c.getPriority(), null
        );

        return saved;
    }

    public Case addOfficerNote(String caseId, CaseNoteRequest request, UserPrincipal officer) {
        Case c = getCaseById(caseId);
        String noteEntry = "[" + LocalDateTime.now().toLocalDate() + " by " + officer.getName() + "]: " + request.getNote();
        c.getOfficerNotes().add(noteEntry);
        c.setUpdatedAt(LocalDateTime.now());

        Case saved = caseRepository.save(c);

        auditLogService.logAction(
                officer.getId(), officer.getEmail(), officer.getAuthorities().toString(),
                "OFFICER_ADDED_NOTE", "CASE", c.getCaseId(),
                null, null, request.getNote(), null
        );

        return saved;
    }
}
