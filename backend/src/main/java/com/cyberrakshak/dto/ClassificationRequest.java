package com.cyberrakshak.dto;

import jakarta.validation.constraints.NotBlank;

public class ClassificationRequest {
    @NotBlank
    private String text;

    public ClassificationRequest() {}

    public ClassificationRequest(String text) {
        this.text = text;
    }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}
