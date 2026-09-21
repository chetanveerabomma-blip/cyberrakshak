package com.cyberrakshak.controller;

import com.cyberrakshak.dto.ClassificationRequest;
import com.cyberrakshak.dto.ClassificationResponse;
import com.cyberrakshak.dto.IncidentRequest;
import com.cyberrakshak.model.Incident;
import com.cyberrakshak.security.UserPrincipal;
import com.cyberrakshak.service.AiClientService;
import com.cyberrakshak.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;
    private final AiClientService aiClientService;

    public IncidentController(IncidentService incidentService, AiClientService aiClientService) {
        this.incidentService = incidentService;
        this.aiClientService = aiClientService;
    }

    @PostMapping("/classify")
    public ResponseEntity<ClassificationResponse> liveClassify(@Valid @RequestBody ClassificationRequest request) {
        return ResponseEntity.ok(aiClientService.classifyText(request.getText()));
    }

    @PostMapping
    public ResponseEntity<Incident> createIncident(
            @Valid @RequestBody IncidentRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(incidentService.createIncident(request, principal));
    }

    @GetMapping
    public ResponseEntity<List<Incident>> getIncidents(@AuthenticationPrincipal UserPrincipal principal) {
        boolean isAdminOrOfficer = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_OFFICER"));

        if (isAdminOrOfficer) {
            return ResponseEntity.ok(incidentService.getAllIncidents());
        } else {
            return ResponseEntity.ok(incidentService.getUserIncidents(principal.getId()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incident> getIncidentById(@PathVariable String id) {
        return ResponseEntity.ok(incidentService.getIncidentById(id));
    }
}
