package com.cyberrakshak.service;

import com.cyberrakshak.dto.UrlScanRequest;
import com.cyberrakshak.model.UrlAnalysis;
import com.cyberrakshak.repository.UrlAnalysisRepository;
import com.cyberrakshak.security.UserPrincipal;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class UrlAnalysisService {

    private final UrlAnalysisRepository urlAnalysisRepository;
    private final AiClientService aiClientService;
    private final AuditLogService auditLogService;

    public UrlAnalysisService(UrlAnalysisRepository urlAnalysisRepository,
                              AiClientService aiClientService,
                              AuditLogService auditLogService) {
        this.urlAnalysisRepository = urlAnalysisRepository;
        this.aiClientService = aiClientService;
        this.auditLogService = auditLogService;
    }

    public UrlAnalysis scanUrl(UrlScanRequest request, UserPrincipal user) {
        String rawUrl = request.getUrl().trim();
        Map<String, Object> aiResult = aiClientService.analyzeUrl(rawUrl);

        int score = ((Number) aiResult.getOrDefault("score", 50)).intValue();
        String riskLevel = (String) aiResult.getOrDefault("riskLevel", "MEDIUM");
        List<String> findings = (List<String>) aiResult.getOrDefault("findings", new ArrayList<>());
        boolean isHttps = Boolean.TRUE.equals(aiResult.get("isSecureHttps"));
        String domain = (String) aiResult.getOrDefault("domain", "");
        String recommendation = (String) aiResult.getOrDefault("recommendation", "Exercise caution.");

        long timestamp = System.currentTimeMillis();
        String scanId = String.format("SCAN-2026-%06d", timestamp % 1000000);

        UrlAnalysis analysis = UrlAnalysis.builder()
                .scanId(scanId)
                .userId(user != null ? user.getId() : "ANONYMOUS")
                .url(rawUrl)
                .domain(domain)
                .score(score)
                .riskLevel(riskLevel)
                .isSecureHttps(isHttps)
                .findings(findings)
                .recommendation(recommendation)
                .createdAt(LocalDateTime.now())
                .build();

        analysis = urlAnalysisRepository.save(analysis);

        if (user != null) {
            auditLogService.logAction(
                    user.getId(), user.getEmail(), user.getAuthorities().toString(),
                    "URL_SCANNED", "URL", scanId,
                    null, riskLevel, "Scanned URL: " + rawUrl + " (Score: " + score + ")", null
            );
        }

        return analysis;
    }

    public List<UrlAnalysis> getUserHistory(String userId) {
        return urlAnalysisRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<UrlAnalysis> getRecentScans() {
        return urlAnalysisRepository.findTop10ByOrderByCreatedAtDesc();
    }

    public void deleteScan(String scanId, String userId) {
        urlAnalysisRepository.findByScanId(scanId).ifPresent(scan -> {
            if (scan.getUserId().equals(userId)) {
                urlAnalysisRepository.delete(scan);
            }
        });
    }
}
