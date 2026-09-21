package com.cyberrakshak.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "incidents")
public class Incident {
    @Id
    private String id;

    @Indexed(unique = true)
    private String incidentId;

    private String userId;
    private String complainantName;
    private String complainantEmail;
    private String complainantPhone;

    private String category;
    private String customCategory;
    private String title;
    private String description;

    private String incidentDate;
    private String incidentTime;
    private Double financialLoss = 0.0;
    private String transactionId;
    private String paymentMethod;
    private String suspectPhone;
    private String suspectEmail;
    private String suspiciousUrl;
    private String socialMediaHandle;
    private String bankName;
    private String state;
    private String district;

    private Double classificationConfidence;
    private Integer riskScore = 0;
    private String riskLevel;

    private List<String> indicators = new ArrayList<>();
    private List<String> riskReasons = new ArrayList<>();
    private List<String> recommendedActions = new ArrayList<>();
    private List<String> evidenceIds = new ArrayList<>();

    private String status = "SUBMITTED";
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Incident() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final Incident incident = new Incident();

        public Builder id(String id) { incident.id = id; return this; }
        public Builder incidentId(String incidentId) { incident.incidentId = incidentId; return this; }
        public Builder userId(String userId) { incident.userId = userId; return this; }
        public Builder complainantName(String complainantName) { incident.complainantName = complainantName; return this; }
        public Builder complainantEmail(String complainantEmail) { incident.complainantEmail = complainantEmail; return this; }
        public Builder complainantPhone(String complainantPhone) { incident.complainantPhone = complainantPhone; return this; }
        public Builder category(String category) { incident.category = category; return this; }
        public Builder customCategory(String customCategory) { incident.customCategory = customCategory; return this; }
        public Builder title(String title) { incident.title = title; return this; }
        public Builder description(String description) { incident.description = description; return this; }
        public Builder incidentDate(String incidentDate) { incident.incidentDate = incidentDate; return this; }
        public Builder incidentTime(String incidentTime) { incident.incidentTime = incidentTime; return this; }
        public Builder financialLoss(Double financialLoss) { incident.financialLoss = financialLoss; return this; }
        public Builder transactionId(String transactionId) { incident.transactionId = transactionId; return this; }
        public Builder paymentMethod(String paymentMethod) { incident.paymentMethod = paymentMethod; return this; }
        public Builder suspectPhone(String suspectPhone) { incident.suspectPhone = suspectPhone; return this; }
        public Builder suspectEmail(String suspectEmail) { incident.suspectEmail = suspectEmail; return this; }
        public Builder suspiciousUrl(String suspiciousUrl) { incident.suspiciousUrl = suspiciousUrl; return this; }
        public Builder socialMediaHandle(String socialMediaHandle) { incident.socialMediaHandle = socialMediaHandle; return this; }
        public Builder bankName(String bankName) { incident.bankName = bankName; return this; }
        public Builder state(String state) { incident.state = state; return this; }
        public Builder district(String district) { incident.district = district; return this; }
        public Builder classificationConfidence(Double classificationConfidence) { incident.classificationConfidence = classificationConfidence; return this; }
        public Builder riskScore(Integer riskScore) { incident.riskScore = riskScore; return this; }
        public Builder riskLevel(String riskLevel) { incident.riskLevel = riskLevel; return this; }
        public Builder indicators(List<String> indicators) { incident.indicators = indicators != null ? indicators : new ArrayList<>(); return this; }
        public Builder riskReasons(List<String> riskReasons) { incident.riskReasons = riskReasons != null ? riskReasons : new ArrayList<>(); return this; }
        public Builder recommendedActions(List<String> recommendedActions) { incident.recommendedActions = recommendedActions != null ? recommendedActions : new ArrayList<>(); return this; }
        public Builder evidenceIds(List<String> evidenceIds) { incident.evidenceIds = evidenceIds != null ? evidenceIds : new ArrayList<>(); return this; }
        public Builder status(String status) { incident.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { incident.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { incident.updatedAt = updatedAt; return this; }

        public Incident build() {
            return incident;
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getIncidentId() { return incidentId; }
    public void setIncidentId(String incidentId) { this.incidentId = incidentId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getComplainantName() { return complainantName; }
    public void setComplainantName(String complainantName) { this.complainantName = complainantName; }
    public String getComplainantEmail() { return complainantEmail; }
    public void setComplainantEmail(String complainantEmail) { this.complainantEmail = complainantEmail; }
    public String getComplainantPhone() { return complainantPhone; }
    public void setComplainantPhone(String complainantPhone) { this.complainantPhone = complainantPhone; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getCustomCategory() { return customCategory; }
    public void setCustomCategory(String customCategory) { this.customCategory = customCategory; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIncidentDate() { return incidentDate; }
    public void setIncidentDate(String incidentDate) { this.incidentDate = incidentDate; }
    public String getIncidentTime() { return incidentTime; }
    public void setIncidentTime(String incidentTime) { this.incidentTime = incidentTime; }
    public Double getFinancialLoss() { return financialLoss; }
    public void setFinancialLoss(Double financialLoss) { this.financialLoss = financialLoss; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getSuspectPhone() { return suspectPhone; }
    public void setSuspectPhone(String suspectPhone) { this.suspectPhone = suspectPhone; }
    public String getSuspectEmail() { return suspectEmail; }
    public void setSuspectEmail(String suspectEmail) { this.suspectEmail = suspectEmail; }
    public String getSuspiciousUrl() { return suspiciousUrl; }
    public void setSuspiciousUrl(String suspiciousUrl) { this.suspiciousUrl = suspiciousUrl; }
    public String getSocialMediaHandle() { return socialMediaHandle; }
    public void setSocialMediaHandle(String socialMediaHandle) { this.socialMediaHandle = socialMediaHandle; }
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public Double getClassificationConfidence() { return classificationConfidence; }
    public void setClassificationConfidence(Double classificationConfidence) { this.classificationConfidence = classificationConfidence; }
    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public List<String> getIndicators() { return indicators; }
    public void setIndicators(List<String> indicators) { this.indicators = indicators; }
    public List<String> getRiskReasons() { return riskReasons; }
    public void setRiskReasons(List<String> riskReasons) { this.riskReasons = riskReasons; }
    public List<String> getRecommendedActions() { return recommendedActions; }
    public void setRecommendedActions(List<String> recommendedActions) { this.recommendedActions = recommendedActions; }
    public List<String> getEvidenceIds() { return evidenceIds; }
    public void setEvidenceIds(List<String> evidenceIds) { this.evidenceIds = evidenceIds; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
