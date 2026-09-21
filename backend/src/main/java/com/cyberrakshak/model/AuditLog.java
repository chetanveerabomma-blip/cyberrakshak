package com.cyberrakshak.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "auditLogs")
public class AuditLog {
    @Id
    private String id;
    private String actorId;
    private String actorEmail;
    private String actorRole;
    private String action;
    private String resource;
    private String resourceId;
    private String previousValue;
    private String newValue;
    private String ipAddress;
    private String details;
    private LocalDateTime timestamp = LocalDateTime.now();

    public AuditLog() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final AuditLog log = new AuditLog();

        public Builder id(String id) { log.id = id; return this; }
        public Builder actorId(String actorId) { log.actorId = actorId; return this; }
        public Builder actorEmail(String actorEmail) { log.actorEmail = actorEmail; return this; }
        public Builder actorRole(String actorRole) { log.actorRole = actorRole; return this; }
        public Builder action(String action) { log.action = action; return this; }
        public Builder resource(String resource) { log.resource = resource; return this; }
        public Builder resourceId(String resourceId) { log.resourceId = resourceId; return this; }
        public Builder previousValue(String previousValue) { log.previousValue = previousValue; return this; }
        public Builder newValue(String newValue) { log.newValue = newValue; return this; }
        public Builder ipAddress(String ipAddress) { log.ipAddress = ipAddress; return this; }
        public Builder details(String details) { log.details = details; return this; }
        public Builder timestamp(LocalDateTime timestamp) { log.timestamp = timestamp; return this; }

        public AuditLog build() {
            return log;
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getActorId() { return actorId; }
    public void setActorId(String actorId) { this.actorId = actorId; }
    public String getActorEmail() { return actorEmail; }
    public void setActorEmail(String actorEmail) { this.actorEmail = actorEmail; }
    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getResource() { return resource; }
    public void setResource(String resource) { this.resource = resource; }
    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }
    public String getPreviousValue() { return previousValue; }
    public void setPreviousValue(String previousValue) { this.previousValue = previousValue; }
    public String getNewValue() { return newValue; }
    public void setNewValue(String newValue) { this.newValue = newValue; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
