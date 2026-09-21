package com.cyberrakshak.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String userId;
    private String title;
    private String message;
    private String type;
    private String relatedCaseId;
    private Boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final Notification n = new Notification();

        public Builder id(String id) { n.id = id; return this; }
        public Builder userId(String userId) { n.userId = userId; return this; }
        public Builder title(String title) { n.title = title; return this; }
        public Builder message(String message) { n.message = message; return this; }
        public Builder type(String type) { n.type = type; return this; }
        public Builder relatedCaseId(String relatedCaseId) { n.relatedCaseId = relatedCaseId; return this; }
        public Builder isRead(Boolean isRead) { n.isRead = isRead; return this; }
        public Builder createdAt(LocalDateTime createdAt) { n.createdAt = createdAt; return this; }

        public Notification build() {
            return n;
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getRelatedCaseId() { return relatedCaseId; }
    public void setRelatedCaseId(String relatedCaseId) { this.relatedCaseId = relatedCaseId; }
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
