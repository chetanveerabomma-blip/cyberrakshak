package com.cyberrakshak.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignCaseRequest {
    @NotBlank
    private String officerId;
    @NotBlank
    private String officerName;
    private String priority;

    public AssignCaseRequest() {}

    public AssignCaseRequest(String officerId, String officerName, String priority) {
        this.officerId = officerId;
        this.officerName = officerName;
        this.priority = priority;
    }

    public String getOfficerId() { return officerId; }
    public void setOfficerId(String officerId) { this.officerId = officerId; }
    public String getOfficerName() { return officerName; }
    public void setOfficerName(String officerName) { this.officerName = officerName; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
