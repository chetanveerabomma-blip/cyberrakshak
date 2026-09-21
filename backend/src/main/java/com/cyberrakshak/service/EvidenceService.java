package com.cyberrakshak.service;

import com.cyberrakshak.model.Evidence;
import com.cyberrakshak.model.Incident;
import com.cyberrakshak.repository.EvidenceRepository;
import com.cyberrakshak.repository.IncidentRepository;
import com.cyberrakshak.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class EvidenceService {

    private static final Logger log = LoggerFactory.getLogger(EvidenceService.class);

    private final EvidenceRepository evidenceRepository;
    private final IncidentRepository incidentRepository;
    private final AuditLogService auditLogService;

    @Value("${app.upload.dir:C:/Users/V CHETAN/.gemini/antigravity/scratch/cyberrakshak/uploads}")
    private String uploadDir;

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "png", "jpg", "jpeg", "webp", "gif", "pdf", "txt", "csv", "doc", "docx", "json", "eml"
    );

    private static final Set<String> DISALLOWED_EXTENSIONS = Set.of(
            "exe", "bat", "cmd", "sh", "vbs", "apk", "com", "msi", "scr", "jar", "js", "vbe", "wsf"
    );

    public EvidenceService(EvidenceRepository evidenceRepository,
                           IncidentRepository incidentRepository,
                           AuditLogService auditLogService) {
        this.evidenceRepository = evidenceRepository;
        this.incidentRepository = incidentRepository;
        this.auditLogService = auditLogService;
    }

    public Evidence uploadEvidence(MultipartFile file, String incidentId, String caseId, String description, UserPrincipal uploader) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "evidence");
        
        if (originalFilename.contains("..") || originalFilename.contains("/") || originalFilename.contains("\\")) {
            throw new IllegalArgumentException("Invalid filename pattern: " + originalFilename);
        }

        String extension = getFileExtension(originalFilename).toLowerCase();
        if (DISALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Executable or malicious file types are strictly rejected: ." + extension);
        }
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("File type not supported for digital evidence. Allowed: images, PDF, text, docs.");
        }

        try {
            byte[] fileBytes = file.getBytes();
            String sha256Hex = calculateSha256(fileBytes);

            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            long timestamp = System.currentTimeMillis();
            String evidenceId = String.format("EV-2026-%06d", timestamp % 1000000);
            String safeStoredName = evidenceId + "_" + originalFilename;
            Path destination = uploadPath.resolve(safeStoredName);

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            Evidence evidence = Evidence.builder()
                    .evidenceId(evidenceId)
                    .incidentId(incidentId)
                    .caseId(caseId)
                    .fileName(originalFilename)
                    .fileType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                    .fileSize(file.getSize())
                    .sha256(sha256Hex)
                    .storageLocation(destination.toString())
                    .description(description != null ? description : "Digital evidence upload")
                    .uploadedBy(uploader.getName())
                    .verificationStatus("VERIFIED")
                    .uploadedAt(LocalDateTime.now())
                    .build();

            Evidence savedEvidence = evidenceRepository.save(evidence);

            if (incidentId != null && !incidentId.isBlank()) {
                incidentRepository.findByIncidentId(incidentId).ifPresent(inc -> {
                    if (inc.getEvidenceIds() == null) {
                        inc.setEvidenceIds(new ArrayList<>());
                    }
                    inc.getEvidenceIds().add(savedEvidence.getEvidenceId());
                    incidentRepository.save(inc);
                });
            }

            auditLogService.logAction(
                    uploader.getId(), uploader.getEmail(), uploader.getAuthorities().toString(),
                    "EVIDENCE_UPLOADED", "EVIDENCE", savedEvidence.getEvidenceId(),
                    null, sha256Hex, "SHA-256 calculated: " + sha256Hex, null
            );

            return savedEvidence;
        } catch (IOException | NoSuchAlgorithmException e) {
            log.error("Failed to upload evidence file", e);
            throw new RuntimeException("Could not store digital evidence securely: " + e.getMessage());
        }
    }

    public List<Evidence> getEvidenceForIncident(String incidentId) {
        return evidenceRepository.findByIncidentId(incidentId);
    }

    public List<Evidence> getEvidenceForCase(String caseId) {
        return evidenceRepository.findByCaseId(caseId);
    }

    public Evidence getEvidenceById(String evidenceId) {
        return evidenceRepository.findByEvidenceId(evidenceId)
                .or(() -> evidenceRepository.findById(evidenceId))
                .orElseThrow(() -> new RuntimeException("Evidence record not found: " + evidenceId));
    }

    public Resource loadFileAsResource(String evidenceId) {
        Evidence ev = getEvidenceById(evidenceId);
        try {
            Path filePath = Paths.get(ev.getStorageLocation());
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Evidence file not found on disk");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error accessing evidence file", e);
        }
    }

    public Map<String, Object> verifyIntegrity(String evidenceId) {
        Evidence ev = getEvidenceById(evidenceId);
        try {
            Path filePath = Paths.get(ev.getStorageLocation());
            byte[] bytes = Files.readAllBytes(filePath);
            String currentHash = calculateSha256(bytes);
            boolean isMatch = currentHash.equalsIgnoreCase(ev.getSha256());

            Map<String, Object> result = new HashMap<>();
            result.put("evidenceId", ev.getEvidenceId());
            result.put("fileName", ev.getFileName());
            result.put("originalSha256", ev.getSha256());
            result.put("currentSha256", currentHash);
            result.put("integrityVerified", isMatch);
            result.put("status", isMatch ? "TAMPER_FREE_VERIFIED" : "INTEGRITY_MISMATCH");
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Integrity check failed: " + e.getMessage());
        }
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1) ? "" : filename.substring(dotIndex + 1);
    }

    private String calculateSha256(byte[] data) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(data);
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
