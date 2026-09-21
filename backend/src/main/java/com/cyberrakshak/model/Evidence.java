package com.cyberrakshak.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "evidence")
public class Evidence {
    @Id
    private String id;

    @Indexed(unique = true)
    private String evidenceId;

    private String incidentId;
    private String caseId;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String sha256;
    private String storageLocation;
    private String description;
    private String uploadedBy;

    private String verificationStatus = "VERIFIED";
    private LocalDateTime uploadedAt = LocalDateTime.now();

    public Evidence() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final Evidence ev = new Evidence();

        public Builder id(String id) { ev.id = id; return this; }
        public Builder evidenceId(String evidenceId) { ev.evidenceId = evidenceId; return this; }
        public Builder incidentId(String incidentId) { ev.incidentId = incidentId; return this; }
        public Builder caseId(String caseId) { ev.caseId = caseId; return this; }
        public Builder fileName(String fileName) { ev.fileName = fileName; return this; }
        public Builder fileType(String fileType) { ev.fileType = fileType; return this; }
        public Builder fileSize(Long fileSize) { ev.fileSize = fileSize; return this; }
        public Builder sha256(String sha256) { ev.sha256 = sha256; return this; }
        public Builder storageLocation(String storageLocation) { ev.storageLocation = storageLocation; return this; }
        public Builder description(String description) { ev.description = description; return this; }
        public Builder uploadedBy(String uploadedBy) { ev.uploadedBy = uploadedBy; return this; }
        public Builder verificationStatus(String status) { ev.verificationStatus = status; return this; }
        public Builder uploadedAt(LocalDateTime uploadedAt) { ev.uploadedAt = uploadedAt; return this; }

        public Evidence build() {
            return ev;
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEvidenceId() { return evidenceId; }
    public void setEvidenceId(String evidenceId) { this.evidenceId = evidenceId; }
    public String getIncidentId() { return incidentId; }
    public void setIncidentId(String incidentId) { this.incidentId = incidentId; }
    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public String getSha256() { return sha256; }
    public void setSha256(String sha256) { this.sha256 = sha256; }
    public String getStorageLocation() { return storageLocation; }
    public void setStorageLocation(String storageLocation) { this.storageLocation = storageLocation; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }
    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
