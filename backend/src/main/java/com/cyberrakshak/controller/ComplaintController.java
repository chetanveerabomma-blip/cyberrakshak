package com.cyberrakshak.controller;

import com.cyberrakshak.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getComplaintDraft(@PathVariable String id) {
        return ResponseEntity.ok(complaintService.generateComplaintDraft(id));
    }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateComplaint(@RequestParam("id") String id) {
        return ResponseEntity.ok(complaintService.generateComplaintDraft(id));
    }
}
