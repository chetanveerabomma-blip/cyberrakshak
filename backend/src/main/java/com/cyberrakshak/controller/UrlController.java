package com.cyberrakshak.controller;

import com.cyberrakshak.dto.UrlScanRequest;
import com.cyberrakshak.model.UrlAnalysis;
import com.cyberrakshak.security.UserPrincipal;
import com.cyberrakshak.service.UrlAnalysisService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/url")
public class UrlController {

    private final UrlAnalysisService urlAnalysisService;

    public UrlController(UrlAnalysisService urlAnalysisService) {
        this.urlAnalysisService = urlAnalysisService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<UrlAnalysis> analyzeUrl(
            @Valid @RequestBody UrlScanRequest request,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(urlAnalysisService.scanUrl(request, user));
    }

    @GetMapping("/history")
    public ResponseEntity<List<UrlAnalysis>> getHistory(@AuthenticationPrincipal UserPrincipal user) {
        if (user == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(urlAnalysisService.getUserHistory(user.getId()));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<UrlAnalysis>> getRecent() {
        return ResponseEntity.ok(urlAnalysisService.getRecentScans());
    }

    @DeleteMapping("/{scanId}")
    public ResponseEntity<Void> deleteScan(
            @PathVariable String scanId,
            @AuthenticationPrincipal UserPrincipal user) {
        if (user != null) {
            urlAnalysisService.deleteScan(scanId, user.getId());
        }
        return ResponseEntity.noContent().build();
    }
}
