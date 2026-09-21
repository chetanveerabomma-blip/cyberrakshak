package com.cyberrakshak.model;

import java.time.LocalDateTime;

public class CaseTimelineEvent {
    private String stage;
    private String title;
    private String description;
    private String updatedBy;
    private LocalDateTime timestamp = LocalDateTime.now();

    public CaseTimelineEvent() {}

    public CaseTimelineEvent(String stage, String title, String description, String updatedBy, LocalDateTime timestamp) {
        this.stage = stage;
        this.title = title;
        this.description = description;
        this.updatedBy = updatedBy;
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String stage;
        private String title;
        private String description;
        private String updatedBy;
        private LocalDateTime timestamp = LocalDateTime.now();

        public Builder stage(String stage) { this.stage = stage; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder updatedBy(String updatedBy) { this.updatedBy = updatedBy; return this; }
        public Builder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public CaseTimelineEvent build() {
            return new CaseTimelineEvent(stage, title, description, updatedBy, timestamp);
        }
    }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
