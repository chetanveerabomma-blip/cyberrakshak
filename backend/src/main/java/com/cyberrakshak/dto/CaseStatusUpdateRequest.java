package com.cyberrakshak.dto;

import jakarta.validation.constraints.NotBlank;

public class CaseStatusUpdateRequest {
    @NotBlank
    private String status;
    private String note;
    private String stageTitle;

    public CaseStatusUpdateRequest() {}

    public CaseStatusUpdateRequest(String status, String note, String stageTitle) {
        this.status = status;
        this.note = note;
        this.stageTitle = stageTitle;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getStageTitle() { return stageTitle; }
    public void setStageTitle(String stageTitle) { this.stageTitle = stageTitle; }
}
