package com.cyberrakshak.controller;

import com.cyberrakshak.model.Evidence;
import com.cyberrakshak.security.UserPrincipal;
import com.cyberrakshak.service.EvidenceService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/evidence")
public class EvidenceController {

    private final EvidenceService evidenceService;

    public EvidenceController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Evidence> uploadEvidence(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "incidentId", required = false) String incidentId,
            @RequestParam(value = "caseId", required = false) String caseId,
            @RequestParam(value = "description", required = false) String description,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(evidenceService.uploadEvidence(file, incidentId, caseId, description, principal));
    }

    @GetMapping("/{evidenceId}")
    public ResponseEntity<Evidence> getEvidence(@PathVariable String evidenceId) {
        return ResponseEntity.ok(evidenceService.getEvidenceById(evidenceId));
    }

    @GetMapping("/incident/{incidentId}")
    public ResponseEntity<List<Evidence>> getIncidentEvidence(@PathVariable String incidentId) {
        return ResponseEntity.ok(evidenceService.getEvidenceForIncident(incidentId));
    }

    @GetMapping("/{evidenceId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable String evidenceId) {
        Evidence ev = evidenceService.getEvidenceById(evidenceId);
        Resource resource = evidenceService.loadFileAsResource(evidenceId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(ev.getFileType() != null ? ev.getFileType() : "application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + ev.getFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/{evidenceId}/verify")
    public ResponseEntity<Map<String, Object>> verifyIntegrity(@PathVariable String evidenceId) {
        return ResponseEntity.ok(evidenceService.verifyIntegrity(evidenceId));
    }
}
