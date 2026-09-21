package com.cyberrakshak.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "urlAnalyses")
public class UrlAnalysis {
    @Id
    private String id;

    @Indexed(unique = true)
    private String scanId;

    private String userId;
    private String url;
    private String domain;
    private Integer score;
    private String riskLevel;
    private Boolean isSecureHttps;
    private List<String> findings = new ArrayList<>();
    private String recommendation;
    private LocalDateTime createdAt = LocalDateTime.now();

    public UrlAnalysis() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final UrlAnalysis u = new UrlAnalysis();

        public Builder id(String id) { u.id = id; return this; }
        public Builder scanId(String scanId) { u.scanId = scanId; return this; }
        public Builder userId(String userId) { u.userId = userId; return this; }
        public Builder url(String url) { u.url = url; return this; }
        public Builder domain(String domain) { u.domain = domain; return this; }
        public Builder score(Integer score) { u.score = score; return this; }
        public Builder riskLevel(String riskLevel) { u.riskLevel = riskLevel; return this; }
        public Builder isSecureHttps(Boolean isSecureHttps) { u.isSecureHttps = isSecureHttps; return this; }
        public Builder findings(List<String> findings) { u.findings = findings != null ? findings : new ArrayList<>(); return this; }
        public Builder recommendation(String recommendation) { u.recommendation = recommendation; return this; }
        public Builder createdAt(LocalDateTime createdAt) { u.createdAt = createdAt; return this; }

        public UrlAnalysis build() {
            return u;
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getScanId() { return scanId; }
    public void setScanId(String scanId) { this.scanId = scanId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public Boolean getIsSecureHttps() { return isSecureHttps; }
    public void setIsSecureHttps(Boolean isSecureHttps) { this.isSecureHttps = isSecureHttps; }
    public List<String> getFindings() { return findings; }
    public void setFindings(List<String> findings) { this.findings = findings; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
