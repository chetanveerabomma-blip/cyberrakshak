package com.cyberrakshak.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class IncidentRequest {
    private String category;
    private String customCategory;
    private String title;

    @NotBlank
    private String description;

    private String incidentDate;
    private String incidentTime;
    private Double financialLoss;
    private String transactionId;
    private String paymentMethod;
    private String suspectPhone;
    private String suspectEmail;
    private String suspiciousUrl;
    private String socialMediaHandle;
    private String bankName;
    private String state;
    private String district;
    private String userConfirmedCategory;
    private List<String> evidenceIds;

    public IncidentRequest() {}

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
    public String getUserConfirmedCategory() { return userConfirmedCategory; }
    public void setUserConfirmedCategory(String userConfirmedCategory) { this.userConfirmedCategory = userConfirmedCategory; }
    public List<String> getEvidenceIds() { return evidenceIds; }
    public void setEvidenceIds(List<String> evidenceIds) { this.evidenceIds = evidenceIds; }
}
