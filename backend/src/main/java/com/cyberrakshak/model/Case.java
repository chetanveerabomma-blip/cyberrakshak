package com.cyberrakshak.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "cases")
public class Case {
    @Id
    private String id;

    @Indexed(unique = true)
    private String caseId;

    private String incidentId;
    private String userId;
    private String complainantName;
    private String complainantEmail;
    private String category;
    private Integer riskScore;
    private String riskLevel;

    private String status = "SUBMITTED";
    private String priority = "MEDIUM";

    private String assignedOfficerId;
    private String assignedOfficerName;

    private List<CaseTimelineEvent> timeline = new ArrayList<>();
    private List<String> officerNotes = new ArrayList<>();
    private List<String> citizenActionChecklist = new ArrayList<>();
    private String resolutionSummary;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Case() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final Case c = new Case();

        public Builder id(String id) { c.id = id; return this; }
        public Builder caseId(String caseId) { c.caseId = caseId; return this; }
        public Builder incidentId(String incidentId) { c.incidentId = incidentId; return this; }
        public Builder userId(String userId) { c.userId = userId; return this; }
        public Builder complainantName(String complainantName) { c.complainantName = complainantName; return this; }
        public Builder complainantEmail(String complainantEmail) { c.complainantEmail = complainantEmail; return this; }
        public Builder category(String category) { c.category = category; return this; }
        public Builder riskScore(Integer riskScore) { c.riskScore = riskScore; return this; }
        public Builder riskLevel(String riskLevel) { c.riskLevel = riskLevel; return this; }
        public Builder status(String status) { c.status = status; return this; }
        public Builder priority(String priority) { c.priority = priority; return this; }
        public Builder assignedOfficerId(String assignedOfficerId) { c.assignedOfficerId = assignedOfficerId; return this; }
        public Builder assignedOfficerName(String assignedOfficerName) { c.assignedOfficerName = assignedOfficerName; return this; }
        public Builder timeline(List<CaseTimelineEvent> timeline) { c.timeline = timeline != null ? timeline : new ArrayList<>(); return this; }
        public Builder officerNotes(List<String> officerNotes) { c.officerNotes = officerNotes != null ? officerNotes : new ArrayList<>(); return this; }
        public Builder citizenActionChecklist(List<String> checklist) { c.citizenActionChecklist = checklist != null ? checklist : new ArrayList<>(); return this; }
        public Builder resolutionSummary(String resolutionSummary) { c.resolutionSummary = resolutionSummary; return this; }
        public Builder createdAt(LocalDateTime createdAt) { c.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { c.updatedAt = updatedAt; return this; }

        public Case build() {
            return c;
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }
    public String getIncidentId() { return incidentId; }
    public void setIncidentId(String incidentId) { this.incidentId = incidentId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getComplainantName() { return complainantName; }
    public void setComplainantName(String complainantName) { this.complainantName = complainantName; }
    public String getComplainantEmail() { return complainantEmail; }
    public void setComplainantEmail(String complainantEmail) { this.complainantEmail = complainantEmail; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getAssignedOfficerId() { return assignedOfficerId; }
    public void setAssignedOfficerId(String assignedOfficerId) { this.assignedOfficerId = assignedOfficerId; }
    public String getAssignedOfficerName() { return assignedOfficerName; }
    public void setAssignedOfficerName(String assignedOfficerName) { this.assignedOfficerName = assignedOfficerName; }
    public List<CaseTimelineEvent> getTimeline() { return timeline; }
    public void setTimeline(List<CaseTimelineEvent> timeline) { this.timeline = timeline; }
    public List<String> getOfficerNotes() { return officerNotes; }
    public void setOfficerNotes(List<String> officerNotes) { this.officerNotes = officerNotes; }
    public List<String> getCitizenActionChecklist() { return citizenActionChecklist; }
    public void setCitizenActionChecklist(List<String> citizenActionChecklist) { this.citizenActionChecklist = citizenActionChecklist; }
    public String getResolutionSummary() { return resolutionSummary; }
    public void setResolutionSummary(String resolutionSummary) { this.resolutionSummary = resolutionSummary; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
