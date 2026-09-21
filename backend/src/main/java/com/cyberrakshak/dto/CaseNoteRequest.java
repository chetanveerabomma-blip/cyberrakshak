package com.cyberrakshak.dto;

import jakarta.validation.constraints.NotBlank;

public class CaseNoteRequest {
    @NotBlank
    private String note;

    public CaseNoteRequest() {}

    public CaseNoteRequest(String note) {
        this.note = note;
    }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
