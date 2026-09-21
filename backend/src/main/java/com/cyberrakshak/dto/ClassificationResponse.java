package com.cyberrakshak.dto;

import java.util.ArrayList;
import java.util.List;

public class ClassificationResponse {
    private String category;
    private Double confidence;
    private String riskLevel;
    private List<String> indicators = new ArrayList<>();
    private List<String> recommendedActions = new ArrayList<>();

    public ClassificationResponse() {}

    public ClassificationResponse(String category, Double confidence, String riskLevel, List<String> indicators, List<String> recommendedActions) {
        this.category = category;
        this.confidence = confidence;
        this.riskLevel = riskLevel;
        this.indicators = indicators != null ? indicators : new ArrayList<>();
        this.recommendedActions = recommendedActions != null ? recommendedActions : new ArrayList<>();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String category;
        private Double confidence;
        private String riskLevel;
        private List<String> indicators = new ArrayList<>();
        private List<String> recommendedActions = new ArrayList<>();

        public Builder category(String category) { this.category = category; return this; }
        public Builder confidence(Double confidence) { this.confidence = confidence; return this; }
        public Builder riskLevel(String riskLevel) { this.riskLevel = riskLevel; return this; }
        public Builder indicators(List<String> indicators) { this.indicators = indicators != null ? indicators : new ArrayList<>(); return this; }
        public Builder recommendedActions(List<String> actions) { this.recommendedActions = actions != null ? actions : new ArrayList<>(); return this; }

        public ClassificationResponse build() {
            return new ClassificationResponse(category, confidence, riskLevel, indicators, recommendedActions);
        }
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public List<String> getIndicators() { return indicators; }
    public void setIndicators(List<String> indicators) { this.indicators = indicators; }
    public List<String> getRecommendedActions() { return recommendedActions; }
    public void setRecommendedActions(List<String> recommendedActions) { this.recommendedActions = recommendedActions; }
}
