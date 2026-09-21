package com.cyberrakshak.service;

import com.cyberrakshak.dto.ClassificationResponse;
import com.cyberrakshak.dto.IncidentRequest;
import com.cyberrakshak.model.*;
import com.cyberrakshak.repository.CaseRepository;
import com.cyberrakshak.repository.IncidentRepository;
import com.cyberrakshak.repository.UserRepository;
import com.cyberrakshak.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class IncidentService {

    private static final Logger log = LoggerFactory.getLogger(IncidentService.class);

    private final IncidentRepository incidentRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final AiClientService aiClientService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public IncidentService(IncidentRepository incidentRepository,
                           CaseRepository caseRepository,
                           UserRepository userRepository,
                           AiClientService aiClientService,
                           NotificationService notificationService,
                           AuditLogService auditLogService) {
        this.incidentRepository = incidentRepository;
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
        this.aiClientService = aiClientService;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    public Incident createIncident(IncidentRequest request, UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ClassificationResponse aiResult = aiClientService.classifyText(request.getDescription());

        String finalCategory = (request.getUserConfirmedCategory() != null && !request.getUserConfirmedCategory().isBlank())
                ? request.getUserConfirmedCategory()
                : (request.getCategory() != null && !request.getCategory().isBlank() ? request.getCategory() : aiResult.getCategory());

        int riskScore = calculateExplainableRisk(
                finalCategory,
                request.getDescription(),
                request.getFinancialLoss() != null ? request.getFinancialLoss() : 0.0,
                request.getSuspiciousUrl()
        );

        String riskLevel = riskScore >= 75 ? "CRITICAL" : (riskScore >= 50 ? "HIGH" : (riskScore >= 25 ? "MEDIUM" : "LOW"));
        List<String> riskReasons = generateRiskReasons(
                finalCategory,
                request.getDescription(),
                request.getFinancialLoss() != null ? request.getFinancialLoss() : 0.0,
                request.getSuspiciousUrl()
        );

        long timestampSuffix = System.currentTimeMillis() % 1000000;
        String incidentId = String.format("CR-INC-%06d", timestampSuffix);
        String caseId = String.format("CR-2026-%06d", timestampSuffix);

        Incident incident = Incident.builder()
                .incidentId(incidentId)
                .userId(user.getId())
                .complainantName(user.getName())
                .complainantEmail(user.getEmail())
                .complainantPhone(user.getPhone() != null ? user.getPhone() : request.getSuspectPhone())
                .category(finalCategory)
                .customCategory(request.getCustomCategory())
                .title(request.getTitle() != null && !request.getTitle().isBlank() ? request.getTitle() : finalCategory.replace("_", " ") + " Incident")
                .description(request.getDescription())
                .incidentDate(request.getIncidentDate() != null ? request.getIncidentDate() : LocalDateTime.now().toLocalDate().toString())
                .incidentTime(request.getIncidentTime())
                .financialLoss(request.getFinancialLoss() != null ? request.getFinancialLoss() : 0.0)
                .transactionId(request.getTransactionId())
                .paymentMethod(request.getPaymentMethod())
                .suspectPhone(request.getSuspectPhone())
                .suspectEmail(request.getSuspectEmail())
                .suspiciousUrl(request.getSuspiciousUrl())
                .socialMediaHandle(request.getSocialMediaHandle())
                .bankName(request.getBankName())
                .state(request.getState() != null ? request.getState() : "Pan India")
                .district(request.getDistrict())
                .classificationConfidence(aiResult.getConfidence())
                .riskScore(riskScore)
                .riskLevel(riskLevel)
                .indicators(aiResult.getIndicators() != null ? aiResult.getIndicators() : new ArrayList<>())
                .riskReasons(riskReasons)
                .recommendedActions(aiResult.getRecommendedActions() != null ? aiResult.getRecommendedActions() : new ArrayList<>())
                .evidenceIds(request.getEvidenceIds() != null ? request.getEvidenceIds() : new ArrayList<>())
                .status("SUBMITTED")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        incident = incidentRepository.save(incident);

        List<CaseTimelineEvent> timeline = new ArrayList<>();
        timeline.add(CaseTimelineEvent.builder()
                .stage("REPORT_SUBMITTED")
                .title("Incident Report Submitted")
                .description("Initial cybercrime incident report received from complainant.")
                .updatedBy(user.getName())
                .timestamp(LocalDateTime.now())
                .build());

        timeline.add(CaseTimelineEvent.builder()
                .stage("AI_CLASSIFIED")
                .title("AI Classification Completed")
                .description(String.format("Identified category: %s with confidence %.0f%%.", finalCategory, aiResult.getConfidence() * 100))
                .updatedBy("CyberRakshak AI Engine")
                .timestamp(LocalDateTime.now().plusSeconds(1))
                .build());

        timeline.add(CaseTimelineEvent.builder()
                .stage("RISK_ASSESSED")
                .title("Explainable Threat Scoring")
                .description(String.format("Assigned Risk Score: %d/100 (%s). Reasons: %s", riskScore, riskLevel, String.join("; ", riskReasons)))
                .updatedBy("CyberRakshak Risk Engine")
                .timestamp(LocalDateTime.now().plusSeconds(2))
                .build());

        Case caseEntity = Case.builder()
                .caseId(caseId)
                .incidentId(incident.getIncidentId())
                .userId(user.getId())
                .complainantName(user.getName())
                .complainantEmail(user.getEmail())
                .category(finalCategory)
                .riskScore(riskScore)
                .riskLevel(riskLevel)
                .status("SUBMITTED")
                .priority(riskLevel.equals("CRITICAL") ? "CRITICAL" : (riskLevel.equals("HIGH") ? "HIGH" : "MEDIUM"))
                .timeline(timeline)
                .citizenActionChecklist(aiResult.getRecommendedActions())
                .officerNotes(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        caseRepository.save(caseEntity);

        notificationService.sendNotification(
                user.getId(),
                "Incident Report Submitted (" + caseId + ")",
                "Your incident has been received and registered under Case ID " + caseId + ". Recommended actions and case timeline are available.",
                "INCIDENT_SUBMITTED",
                caseId
        );

        auditLogService.logAction(
                user.getId(), user.getEmail(), user.getRole().name(),
                "CITIZEN_SUBMITTED_INCIDENT", "INCIDENT", incident.getIncidentId(),
                null, "SUBMITTED", "Incident created with risk score " + riskScore, null
        );

        return incident;
    }

    public List<Incident> getUserIncidents(String userId) {
        return incidentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Incident getIncidentById(String id) {
        return incidentRepository.findByIncidentId(id)
                .or(() -> incidentRepository.findById(id))
                .orElseThrow(() -> new RuntimeException("Incident not found: " + id));
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    private int calculateExplainableRisk(String category, String desc, double loss, String url) {
        int score = 20;
        String lower = (desc != null ? desc.toLowerCase() : "");

        if (loss > 100000) score += 30;
        else if (loss > 10000) score += 20;
        else if (loss > 0) score += 10;

        if (lower.contains("otp") || lower.contains("cvv") || lower.contains("pin")) score += 25;
        if (lower.contains("bank") || lower.contains("sbi") || lower.contains("hdfc") || lower.contains("icici") || lower.contains("debit")) score += 15;
        if (url != null && !url.isBlank()) score += 15;
        if (lower.contains("apk") || lower.contains("anydesk") || lower.contains("teamviewer")) score += 25;
        if (lower.contains("digital arrest") || lower.contains("police") || lower.contains("cbi") || lower.contains("warrant")) score += 20;

        if ("OTP_FRAUD".equalsIgnoreCase(category) || "MALWARE".equalsIgnoreCase(category)) score += 15;
        else if ("UPI_SCAM".equalsIgnoreCase(category) || "INVESTMENT_SCAM".equalsIgnoreCase(category)) score += 10;

        return Math.max(10, Math.min(score, 100));
    }

    private List<String> generateRiskReasons(String category, String desc, double loss, String url) {
        List<String> reasons = new ArrayList<>();
        String lower = (desc != null ? desc.toLowerCase() : "");

        if (loss > 0) {
            reasons.add(String.format("Direct monetary loss reported (Rs %,.2f)", loss));
        }
        if (lower.contains("otp") || lower.contains("cvv") || lower.contains("pin")) {
            reasons.add("Critical authentication credential (OTP/PIN/CVV) exposed");
        }
        if (lower.contains("bank") || lower.contains("sbi") || lower.contains("hdfc") || lower.contains("icici")) {
            reasons.add("Banking credentials / net banking channel involvement");
        }
        if (url != null && !url.isBlank()) {
            reasons.add("Unverified suspicious URL/link used in attack vector");
        }
        if (lower.contains("apk") || lower.contains("anydesk") || lower.contains("teamviewer")) {
            reasons.add("Malicious software / remote desktop screen-sharing application indicated");
        }
        if (lower.contains("digital arrest") || lower.contains("police") || lower.contains("cbi") || lower.contains("warrant")) {
            reasons.add("Severe psychological coercion / fake law enforcement impersonation");
        }
        if (reasons.isEmpty()) {
            reasons.add("Standard cyber fraud risk pattern detected");
        }
        return reasons;
    }
}
