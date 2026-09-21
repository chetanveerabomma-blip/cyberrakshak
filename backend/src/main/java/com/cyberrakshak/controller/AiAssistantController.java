package com.cyberrakshak.controller;

import com.cyberrakshak.dto.ChatRequest;
import com.cyberrakshak.dto.ChatResponse;
import com.cyberrakshak.service.AiClientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AiAssistantController {

    private final AiClientService aiClientService;

    public AiAssistantController(AiClientService aiClientService) {
        this.aiClientService = aiClientService;
    }

    @PostMapping("/ai/chat")
    public ResponseEntity<ChatResponse> chatWithAssistant(@Valid @RequestBody ChatRequest request) {
        String answer = aiClientService.getChatAdvice(request.getQuery());
        return ResponseEntity.ok(ChatResponse.builder().response(answer).build());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "cyberrakshak-backend",
                "version", "1.0.0"
        ));
    }
}
