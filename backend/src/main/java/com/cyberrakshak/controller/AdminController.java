package com.cyberrakshak.controller;

import com.cyberrakshak.dto.AnalyticsResponse;
import com.cyberrakshak.model.AuditLog;
import com.cyberrakshak.model.User;
import com.cyberrakshak.repository.AuditLogRepository;
import com.cyberrakshak.repository.UserRepository;
import com.cyberrakshak.security.UserPrincipal;
import com.cyberrakshak.service.AnalyticsService;
import com.cyberrakshak.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_OFFICER')")
public class AdminController {

    private final AnalyticsService analyticsService;
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public AdminController(AnalyticsService analyticsService,
                           AuditLogRepository auditLogRepository,
                           UserRepository userRepository,
                           AuditLogService auditLogService) {
        this.analyticsService = analyticsService;
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics());
    }

    @GetMapping("/scam-patterns")
    public ResponseEntity<List<Map<String, Object>>> getScamPatterns() {
        return ResponseEntity.ok(analyticsService.detectScamPatterns());
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findTop50ByOrderByTimestampDesc());
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{userId}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable String userId,
            @RequestParam String status,
            @AuthenticationPrincipal UserPrincipal admin) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String oldStatus = user.getStatus();
        user.setStatus(status);
        User saved = userRepository.save(user);

        auditLogService.logAction(
                admin.getId(), admin.getEmail(), admin.getAuthorities().toString(),
                "ADMIN_UPDATED_USER_STATUS", "USER", userId,
                oldStatus, status, "Changed status for " + user.getEmail(), null
        );

        return ResponseEntity.ok(saved);
    }
}
