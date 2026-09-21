package com.cyberrakshak.service;

import com.cyberrakshak.dto.ClassificationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiClientService {

    private static final Logger log = LoggerFactory.getLogger(AiClientService.class);

    @Value("${app.ai-service.url:http://localhost:8000}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public AiClientService() {}

    public ClassificationResponse classifyText(String text) {
        try {
            String url = aiServiceUrl + "/predict-scam";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = Map.of("text", text);
            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> data = response.getBody();
                return ClassificationResponse.builder()
                        .category((String) data.getOrDefault("category", "OTHER"))
                        .confidence(((Number) data.getOrDefault("confidence", 0.85)).doubleValue())
                        .riskLevel((String) data.getOrDefault("riskLevel", "HIGH"))
                        .indicators((List<String>) data.getOrDefault("indicators", List.of("Automated threat patterns detected")))
                        .recommendedActions((List<String>) data.getOrDefault("recommendedActions", List.of("Preserve evidence and contact 1930")))
                        .build();
            }
        } catch (Exception e) {
            log.warn("Python AI microservice call failed ({}), activating fallback rule-based classifier", e.getMessage());
        }

        return fallbackClassify(text);
    }

    public Map<String, Object> analyzeUrl(String targetUrl) {
        try {
            String url = aiServiceUrl + "/analyze-url";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = Map.of("url", targetUrl);
            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.warn("Python AI URL analysis failed ({}), using fallback heuristic scanner", e.getMessage());
        }

        return fallbackUrlAnalyze(targetUrl);
    }

    public String getChatAdvice(String query) {
        try {
            String url = aiServiceUrl + "/assistant-chat";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = Map.of("query", query);
            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (String) response.getBody().get("response");
            }
        } catch (Exception e) {
            log.warn("AI Assistant query failed ({})", e.getMessage());
        }
        return "🛡️ **CyberRakshak Advisory:** If you suspect a cyber crime, call the National Cyber Helpline 1930 immediately within the golden hour to block unauthorized transactions, and lodge an official complaint on cybercrime.gov.in.";
    }

    private ClassificationResponse fallbackClassify(String text) {
        String lower = text != null ? text.toLowerCase() : "";
        String category = "OTHER";
        double confidence = 0.85;
        String riskLevel = "MEDIUM";
        List<String> indicators = new ArrayList<>();
        List<String> actions = new ArrayList<>();

        if (lower.contains("upi") || lower.contains("phonepe") || lower.contains("gpay") || lower.contains("qr code") || lower.contains("bhim")) {
            category = "UPI_SCAM";
            confidence = 0.93;
            riskLevel = "HIGH";
            indicators.add("UPI payment fraud indicator");
            indicators.add("QR code / PIN deception");
            actions.add("Call bank emergency helpline or 1930 to freeze transaction");
            actions.add("Raise dispute in UPI app with UTR reference");
        } else if (lower.contains("otp") || lower.contains("cvv") || lower.contains("card blocked")) {
            category = "OTP_FRAUD";
            confidence = 0.95;
            riskLevel = "CRITICAL";
            indicators.add("Critical OTP disclosure");
            indicators.add("Urgent banking coercion");
            actions.add("Immediately block debit/credit cards");
            actions.add("Lock net banking access");
        } else if (lower.contains("job") || lower.contains("task") || lower.contains("telegram") || lower.contains("youtube like")) {
            category = "FAKE_JOB";
            confidence = 0.91;
            riskLevel = "HIGH";
            indicators.add("Prepaid task / work-from-home fraud pattern");
            actions.add("Cease communication and do not pay any task release fees");
        } else if (lower.contains("http") || lower.contains("link") || lower.contains("pan update") || lower.contains("bill unpaid")) {
            category = "PHISHING";
            confidence = 0.89;
            riskLevel = "HIGH";
            indicators.add("Suspicious hyperlink vector");
            actions.add("Do not enter credentials and change your passwords");
        } else {
            indicators.add("General suspicious pattern");
            actions.add("Preserve evidence and contact 1930");
        }

        return ClassificationResponse.builder()
                .category(category)
                .confidence(confidence)
                .riskLevel(riskLevel)
                .indicators(indicators)
                .recommendedActions(actions)
                .build();
    }

    private Map<String, Object> fallbackUrlAnalyze(String url) {
        boolean isHttps = url != null && url.startsWith("https://");
        int score = isHttps ? 35 : 70;
        List<String> findings = new ArrayList<>();
        if (!isHttps) findings.add("Insecure plain HTTP connection");
        if (url != null && (url.contains(".xyz") || url.contains(".top") || url.contains(".club"))) {
            score += 25;
            findings.add("High-risk TLD commonly used in phishing scams");
        }
        if (url != null && (url.contains("login") || url.contains("verify") || url.contains("kyc"))) {
            score += 15;
            findings.add("Sensitive verification path keyword detected");
        }
        score = Math.min(score, 100);

        String level = score >= 75 ? "CRITICAL" : (score >= 50 ? "HIGH" : (score >= 25 ? "MEDIUM" : "LOW"));
        Map<String, Object> res = new HashMap<>();
        res.put("url", url);
        res.put("score", score);
        res.put("riskLevel", level);
        res.put("findings", findings);
        res.put("isSecureHttps", isHttps);
        res.put("recommendation", score >= 50 ? "DO NOT open this link or enter passwords." : "Proceed with standard caution.");
        return res;
    }
}
