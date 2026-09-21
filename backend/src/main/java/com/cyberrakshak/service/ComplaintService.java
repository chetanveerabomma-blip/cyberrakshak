package com.cyberrakshak.service;

import com.cyberrakshak.model.Case;
import com.cyberrakshak.model.Evidence;
import com.cyberrakshak.model.Incident;
import com.cyberrakshak.repository.CaseRepository;
import com.cyberrakshak.repository.EvidenceRepository;
import com.cyberrakshak.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ComplaintService {

    private final IncidentRepository incidentRepository;
    private final CaseRepository caseRepository;
    private final EvidenceRepository evidenceRepository;

    public ComplaintService(IncidentRepository incidentRepository,
                            CaseRepository caseRepository,
                            EvidenceRepository evidenceRepository) {
        this.incidentRepository = incidentRepository;
        this.caseRepository = caseRepository;
        this.evidenceRepository = evidenceRepository;
    }

    public Map<String, Object> generateComplaintDraft(String incidentOrCaseId) {
        Incident incident = incidentRepository.findByIncidentId(incidentOrCaseId)
                .or(() -> caseRepository.findByCaseId(incidentOrCaseId)
                        .flatMap(c -> incidentRepository.findByIncidentId(c.getIncidentId())))
                .orElseThrow(() -> new RuntimeException("Incident or Case record not found for: " + incidentOrCaseId));

        List<Evidence> evidenceList = evidenceRepository.findByIncidentId(incident.getIncidentId());

        StringBuilder doc = new StringBuilder();
        doc.append("================================================================================\n");
        doc.append("                  CYBER CRIME INCIDENT COMPLAINT DRAFT                         \n");
        doc.append("             (Generated via CyberRakshak Incident Response System)              \n");
        doc.append("================================================================================\n\n");

        doc.append("IMPORTANT NOTICE:\n");
        doc.append("This document is a structured preliminary incident draft generated to assist the\n");
        doc.append("victim in organizing facts, timestamps, and cryptographic digital evidence.\n");
        doc.append("This draft must be formally submitted to the National Cyber Crime Reporting Portal\n");
        doc.append("(https://cybercrime.gov.in) or presented at the nearest Cyber Police Station.\n\n");

        doc.append("1. COMPLAINANT IDENTIFICATION:\n");
        doc.append("--------------------------------------------------------------------------------\n");
        doc.append(String.format("Full Name          : %s\n", incident.getComplainantName()));
        doc.append(String.format("Email Address      : %s\n", incident.getComplainantEmail()));
        doc.append(String.format("Phone Number       : %s\n", incident.getComplainantPhone() != null ? incident.getComplainantPhone() : "N/A"));
        doc.append(String.format("State / Region     : %s\n", incident.getState() != null ? incident.getState() : "N/A"));
        doc.append(String.format("District / City    : %s\n\n", incident.getDistrict() != null ? incident.getDistrict() : "N/A"));

        doc.append("2. INCIDENT PARTICULARS:\n");
        doc.append("--------------------------------------------------------------------------------\n");
        doc.append(String.format("Incident Reference : %s\n", incident.getIncidentId()));
        doc.append(String.format("Category / Type    : %s\n", incident.getCategory()));
        doc.append(String.format("Date of Occurrence : %s\n", incident.getIncidentDate()));
        doc.append(String.format("Time of Occurrence : %s\n", incident.getIncidentTime() != null ? incident.getIncidentTime() : "Unspecified"));
        doc.append(String.format("Calculated Threat  : Score %d/100 (%s RISK)\n\n", incident.getRiskScore(), incident.getRiskLevel()));

        doc.append("3. FINANCIAL LOSS & TRANSACTION DETAILS:\n");
        doc.append("--------------------------------------------------------------------------------\n");
        doc.append(String.format("Total Loss Amount  : INR %,.2f\n", incident.getFinancialLoss()));
        doc.append(String.format("Transaction ID/UTR : %s\n", incident.getTransactionId() != null ? incident.getTransactionId() : "N/A"));
        doc.append(String.format("Payment Mode / App : %s\n", incident.getPaymentMethod() != null ? incident.getPaymentMethod() : "N/A"));
        doc.append(String.format("Bank / Provider    : %s\n\n", incident.getBankName() != null ? incident.getBankName() : "N/A"));

        doc.append("4. SUSPECT / PERPETRATOR INFORMATION:\n");
        doc.append("--------------------------------------------------------------------------------\n");
        doc.append(String.format("Suspect Phone/VPA  : %s\n", incident.getSuspectPhone() != null ? incident.getSuspectPhone() : "Unknown"));
        doc.append(String.format("Suspect Email      : %s\n", incident.getSuspectEmail() != null ? incident.getSuspectEmail() : "Unknown"));
        doc.append(String.format("Suspicious URL/Link: %s\n", incident.getSuspiciousUrl() != null ? incident.getSuspiciousUrl() : "None"));
        doc.append(String.format("Social Media Handle: %s\n\n", incident.getSocialMediaHandle() != null ? incident.getSocialMediaHandle() : "None"));

        doc.append("5. CHRONOLOGICAL NARRATIVE OF EVENTS:\n");
        doc.append("--------------------------------------------------------------------------------\n");
        doc.append(incident.getDescription()).append("\n\n");

        doc.append("6. PRESERVED DIGITAL EVIDENCE & INTEGRITY CHECKSUMS (SHA-256):\n");
        doc.append("--------------------------------------------------------------------------------\n");
        if (evidenceList.isEmpty()) {
            doc.append("No digital attachments uploaded at time of draft generation.\n\n");
        } else {
            int index = 1;
            for (Evidence ev : evidenceList) {
                doc.append(String.format("[%d] %s (%s, %,d bytes)\n", index++, ev.getFileName(), ev.getFileType(), ev.getFileSize()));
                doc.append(String.format("    SHA-256 Checksum: %s\n", ev.getSha256()));
                doc.append(String.format("    Description     : %s\n\n", ev.getDescription()));
            }
        }

        doc.append("7. LEGAL DECLARATION:\n");
        doc.append("--------------------------------------------------------------------------------\n");
        doc.append("I hereby declare that the particulars given above are true and correct to the best\n");
        doc.append("of my knowledge and belief. I understand that filing a false report is an offense\n");
        doc.append("punishable under Section 182 / 211 of the Indian Penal Code.\n\n");

        doc.append(String.format("Draft Date: %s\n", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm:ss"))));
        doc.append("Complainant Signature: ____________________________\n");

        Map<String, Object> response = new HashMap<>();
        response.put("incidentId", incident.getIncidentId());
        response.put("complainantName", incident.getComplainantName());
        response.put("category", incident.getCategory());
        response.put("financialLoss", incident.getFinancialLoss());
        response.put("riskLevel", incident.getRiskLevel());
        response.put("evidenceCount", evidenceList.size());
        response.put("formattedComplaintText", doc.toString());
        response.put("disclaimer", "This is an automated complaint draft. Please present it to authorities or upload it to cybercrime.gov.in.");

        return response;
    }
}
