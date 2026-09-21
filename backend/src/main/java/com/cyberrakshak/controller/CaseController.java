package com.cyberrakshak.controller;

import com.cyberrakshak.dto.AssignCaseRequest;
import com.cyberrakshak.dto.CaseNoteRequest;
import com.cyberrakshak.dto.CaseStatusUpdateRequest;
import com.cyberrakshak.model.Case;
import com.cyberrakshak.security.UserPrincipal;
import com.cyberrakshak.service.CaseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
public class CaseController {

    private final CaseService caseService;

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    @GetMapping
    public ResponseEntity<List<Case>> getCases(@AuthenticationPrincipal UserPrincipal principal) {
        boolean isAdminOrOfficer = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_OFFICER"));

        if (isAdminOrOfficer) {
            return ResponseEntity.ok(caseService.getAllCases());
        } else {
            return ResponseEntity.ok(caseService.getUserCases(principal.getId()));
        }
    }

    @GetMapping("/{caseId}")
    public ResponseEntity<Case> getCaseById(@PathVariable String caseId) {
        return ResponseEntity.ok(caseService.getCaseById(caseId));
    }

    @GetMapping("/track/{caseId}")
    public ResponseEntity<Case> trackCasePublic(
            @PathVariable String caseId,
            @RequestParam(required = false) String email) {
        return ResponseEntity.ok(caseService.trackCasePublic(caseId, email));
    }

    @PutMapping("/{caseId}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_OFFICER')")
    public ResponseEntity<Case> updateStatus(
            @PathVariable String caseId,
            @Valid @RequestBody CaseStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(caseService.updateCaseStatus(caseId, request, principal));
    }

    @PutMapping("/{caseId}/assign")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Case> assignOfficer(
            @PathVariable String caseId,
            @Valid @RequestBody AssignCaseRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(caseService.assignOfficer(caseId, request, principal));
    }

    @PostMapping("/{caseId}/notes")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_OFFICER')")
    public ResponseEntity<Case> addNote(
            @PathVariable String caseId,
            @Valid @RequestBody CaseNoteRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(caseService.addOfficerNote(caseId, request, principal));
    }
}
