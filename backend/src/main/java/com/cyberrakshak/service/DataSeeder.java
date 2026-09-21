package com.cyberrakshak.service;

import com.cyberrakshak.model.*;
import com.cyberrakshak.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final IncidentRepository incidentRepository;
    private final CaseRepository caseRepository;
    private final UrlAnalysisRepository urlAnalysisRepository;
    private final AwarenessRepository awarenessRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      IncidentRepository incidentRepository,
                      CaseRepository caseRepository,
                      UrlAnalysisRepository urlAnalysisRepository,
                      AwarenessRepository awarenessRepository,
                      AuditLogRepository auditLogRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.incidentRepository = incidentRepository;
        this.caseRepository = caseRepository;
        this.urlAnalysisRepository = urlAnalysisRepository;
        this.awarenessRepository = awarenessRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            log.info("Starting initial CyberRakshak database seed...");
            seedUsers();
            seedIncidentsAndCases();
            seedUrlAnalyses();
            seedAwarenessArticles();
            seedAuditLogs();
            log.info("CyberRakshak demo data seeded successfully!");
        }
    }

    private void seedUsers() {
        String pass = passwordEncoder.encode("Password123!");

        User admin = User.builder()
                .name("Super Admin CyberRakshak")
                .email("admin@cyberrakshak.in")
                .phone("+91-9876543210")
                .passwordHash(pass)
                .role(Role.ROLE_ADMIN)
                .status("ACTIVE")
                .createdAt(LocalDateTime.now().minusDays(30))
                .build();
        userRepository.save(admin);

        User officer1 = User.builder()
                .name("Inspector Vikram Rathore")
                .email("vikram.rathore@cyberrakshak.in")
                .phone("+91-9876543211")
                .passwordHash(pass)
                .role(Role.ROLE_OFFICER)
                .status("ACTIVE")
                .createdAt(LocalDateTime.now().minusDays(25))
                .build();
        User officer2 = User.builder()
                .name("Sub-Inspector Ananya Sharma")
                .email("ananya.sharma@cyberrakshak.in")
                .phone("+91-9876543212")
                .passwordHash(pass)
                .role(Role.ROLE_OFFICER)
                .status("ACTIVE")
                .createdAt(LocalDateTime.now().minusDays(20))
                .build();
        userRepository.saveAll(List.of(officer1, officer2));

        String[] citizenNames = {
                "Rahul Verma (Student)", "Pooja Hegde", "Arjun Nair", "Sneha Roy",
                "Mohit Agrawal", "Divya Krishnan", "Karan Malhotra", "Meera Iyer"
        };
        for (int i = 0; i < citizenNames.length; i++) {
            User citizen = User.builder()
                    .name(citizenNames[i])
                    .email("citizen" + (i + 1) + "@demo.com")
                    .phone("+91-98100123" + (10 + i))
                    .passwordHash(pass)
                    .role(Role.ROLE_CITIZEN)
                    .status("ACTIVE")
                    .createdAt(LocalDateTime.now().minusDays(15 - i))
                    .build();
            userRepository.save(citizen);
        }
    }

    private void seedIncidentsAndCases() {
        List<User> citizens = userRepository.findByRole(Role.ROLE_CITIZEN);
        if (citizens.isEmpty()) return;

        User c1 = citizens.get(0);
        User c2 = citizens.size() > 1 ? citizens.get(1) : c1;
        User c3 = citizens.size() > 2 ? citizens.get(2) : c1;

        Object[][] incidentData = {
                {
                        "CR-INC-2026-000101", "CR-2026-000101", c1.getId(), c1.getName(), c1.getEmail(),
                        "UPI_SCAM", "OLX QR Code Scanner Fraud",
                        "Listed an old bicycle on OLX for Rs 4,500. Buyer sent a QR code stating 'Scan this QR code to receive Rs 4500 on PhonePe'. Upon scanning and entering my UPI PIN, Rs 4,500 was deducted instead.",
                        "2026-09-18", "14:30", 4500.0, "UPI/2026/8931208", "PhonePe",
                        "+91-9871100223", "fakebuyer99@gmail.com", "http://pay-phonepe-receive.xyz",
                        "State Bank of India", "Karnataka", "Bengaluru", 75, "HIGH", "UNDER_REVIEW"
                },
                {
                        "CR-INC-2026-000102", "CR-2026-000102", c2.getId(), c2.getName(), c2.getEmail(),
                        "PHISHING", "Fake HDFC Bank KYC Update SMS",
                        "Received an SMS: 'Dear Customer, your HDFC netbanking will be blocked today. Update your PAN card at bit.ly/hdfc-pan-portal'. Entered credentials and OTP on the spoofed landing page.",
                        "2026-09-17", "11:15", 35000.0, "TXN77621903", "Net Banking",
                        "+91-9988223344", "support@hdfc-pan-portal.xyz", "https://hdfc-pan-update.top/login",
                        "HDFC Bank", "Maharashtra", "Mumbai", 90, "CRITICAL", "INVESTIGATION"
                },
                {
                        "CR-INC-2026-000103", "CR-2026-000103", c3.getId(), c3.getName(), c3.getEmail(),
                        "FAKE_JOB", "Telegram Part-Time YouTube Review Task Scam",
                        "Contacted on WhatsApp offering remote work to like YouTube videos for Rs 50 each. After 3 tasks, was added to a Telegram VIP group and convinced to invest Rs 25,000 in prepaid cryptocurrency tasks.",
                        "2026-09-16", "17:45", 25000.0, "IMPS88219381", "IMPS",
                        "+91-8899001122", "hr@amazon-telejob.com", "http://amazon-vip-task.club",
                        "ICICI Bank", "Delhi", "New Delhi", 70, "HIGH", "ASSIGNED"
                },
                {
                        "CR-INC-2026-000104", "CR-2026-000104", c1.getId(), c1.getName(), c1.getEmail(),
                        "OTP_FRAUD", "Fake Electricity Bill Power Cut Call",
                        "Caller claimed to be from BESCOM Electricity Board stating power will be disconnected at 9 PM. Convinced my mother to download QuickSupport and share an OTP sent via SMS.",
                        "2026-09-15", "19:00", 18500.0, "UPI/2026/7781923", "GPay",
                        "+91-9871100223", "bescom-support@rediffmail.com", "http://bescom-bill-update.online",
                        "Canara Bank", "Karnataka", "Bengaluru", 88, "CRITICAL", "INVESTIGATION"
                },
                {
                        "CR-INC-2026-000105", "CR-2026-000105", c2.getId(), c2.getName(), c2.getEmail(),
                        "FAKE_SHOPPING", "Counterfeit Electronics Instagram Store",
                        "Saw an Instagram ad for Sony headphones at 75% discount on shop-audio-india.com. Paid Rs 2,999 through UPI gateway. Account blocked, no shipment or customer support response.",
                        "2026-09-14", "13:20", 2999.0, "RAZOR992187", "UPI",
                        "+91-9711223344", "order@shop-audio-india.com", "https://shop-audio-india.com",
                        "Axis Bank", "Tamil Nadu", "Chennai", 45, "MEDIUM", "SUBMITTED"
                },
                {
                        "CR-INC-2026-000106", "CR-2026-000106", c3.getId(), c3.getName(), c3.getEmail(),
                        "ACCOUNT_TAKEOVER", "Instagram Influencer Profile Hijacking",
                        "Received a fake copyright infringement message on Instagram with an appeal link. Clicked link, and credentials were compromised. 2FA number and recovery email altered by hacker.",
                        "2026-09-13", "22:10", 0.0, "N/A", "N/A",
                        "+1-2025550198", "support@meta-copyright-center.com", "https://instagram-copyright-appeal.rest",
                        "N/A", "Telangana", "Hyderabad", 65, "HIGH", "ACTION_RECOMMENDED"
                },
                {
                        "CR-INC-2026-000107", "CR-2026-000107", c1.getId(), c1.getName(), c1.getEmail(),
                        "INVESTMENT_SCAM", "Bogus Institutional Crypto Trading App",
                        "Joined a WhatsApp group called 'Golden Eagle Institutional Trading'. Instructed to deposit USDT into an unverified portal showing 300% profit. When requesting withdrawal, demanded 30% tax fee.",
                        "2026-09-12", "16:00", 120000.0, "TXN99281729", "Crypto USDT / Bank",
                        "+91-9122334455", "vip-admin@goldeneagletrade.vip", "https://goldeneagletrade.vip/app",
                        "HDFC Bank", "Gujarat", "Ahmedabad", 95, "CRITICAL", "INVESTIGATION"
                },
                {
                        "CR-INC-2026-000108", "CR-2026-000108", c2.getId(), c2.getName(), c2.getEmail(),
                        "MALWARE", "Malicious PM-Kisan APK WhatsApp Forward",
                        "Downloaded an Android APK file named 'PM_Kisan_16th_Kist.apk' forwarded in a family group. Mobile phone began auto-forwarding OTP messages and battery drained rapidly.",
                        "2026-09-11", "10:00", 5000.0, "UPI/2026/1029384", "Paytm",
                        "+91-9344556677", "pmkisan-support@gmail.com", "http://pm-kisan-portal.apk.xyz",
                        "Punjab National Bank", "Uttar Pradesh", "Lucknow", 85, "CRITICAL", "RESOLVED"
                },
                {
                        "CR-INC-2026-000109", "CR-2026-000109", c3.getId(), c3.getName(), c3.getEmail(),
                        "SOCIAL_MEDIA_FRAUD", "Imposter Profile Friend Medical Emergency",
                        "A cloned Facebook profile of my college classmate reached out on Messenger claiming urgent hospital deposit needed for mother. Transferred Rs 8,000 to an unknown UPI ID.",
                        "2026-09-10", "15:30", 8000.0, "UPI/2026/8912384", "GPay",
                        "+91-9788112233", "urgent-help99@okaxis", "None",
                        "Kotak Mahindra", "West Bengal", "Kolkata", 55, "HIGH", "RESOLVED"
                },
                {
                        "CR-INC-2026-000110", "CR-2026-000110", c1.getId(), c1.getName(), c1.getEmail(),
                        "IDENTITY_THEFT", "Fraudulent Instant Loan on Stolen PAN",
                        "Received a collection recovery notice from an instant lending app for a Rs 50,000 loan taken in my name. Never registered on the app; my Aadhaar/PAN documents were leaked.",
                        "2026-09-09", "12:00", 50000.0, "LOAN-REG-88219", "Instant Credit",
                        "+91-9555667788", "recovery@instantloannow.com", "https://instantloannow.com",
                        "IDFC First", "Rajasthan", "Jaipur", 80, "HIGH", "INVESTIGATION"
                },
                {
                        "CR-INC-2026-000111", "CR-2026-000111", c2.getId(), c2.getName(), c2.getEmail(),
                        "UPI_SCAM", "Fake Paytm Merchant Payment Reversal",
                        "Scammer sent a fake screenshot claiming they mistakenly sent Rs 10,000 to my UPI and pleaded with tears to refund. I sent Rs 10,000 without checking my actual bank balance.",
                        "2026-09-08", "18:20", 10000.0, "UPI/2026/3344556", "Paytm",
                        "+91-9871100223", "reversal99@paytm", "None",
                        "State Bank of India", "Kerala", "Kochi", 65, "HIGH", "CLOSED"
                },
                {
                        "CR-INC-2026-000112", "CR-2026-000112", c3.getId(), c3.getName(), c3.getEmail(),
                        "PHISHING", "Income Tax Refund Notification Trap",
                        "Received an email purporting to be from Income Tax Department stating tax refund of Rs 24,500 pending approval. Entered bank account number and debit card details on spoofed page.",
                        "2026-09-07", "09:40", 42000.0, "TXN/2026/902182", "Debit Card",
                        "+91-9444332211", "refund@incometax-filing-india.top", "https://incometax-efiling-portal.top",
                        "HDFC Bank", "Maharashtra", "Pune", 88, "CRITICAL", "UNDER_REVIEW"
                },
                {
                        "CR-INC-2026-000113", "CR-2026-000113", c1.getId(), c1.getName(), c1.getEmail(),
                        "FAKE_JOB", "Airline Ground Staff Remote Placement Fee",
                        "Received an offer letter with fake logo for Indigo ground staff. Instructed to pay Rs 6,500 for uniform and medical clearance certificate. Contact disappeared afterwards.",
                        "2026-09-06", "11:00", 6500.0, "UPI/2026/7788990", "PhonePe",
                        "+91-9233445566", "careers@indigo-groundservices.in", "http://indigo-groundservices.in",
                        "Axis Bank", "Madhya Pradesh", "Indore", 50, "MEDIUM", "RESOLVED"
                },
                {
                        "CR-INC-2026-000114", "CR-2026-000114", c2.getId(), c2.getName(), c2.getEmail(),
                        "OTP_FRAUD", "Credit Card Reward Points Expiry Call",
                        "Caller informed that 8,000 credit card reward points worth Rs 4,000 will expire tonight. Directed to redeem by confirming an OTP sent by the bank.",
                        "2026-09-05", "20:15", 38000.0, "TXN99881122", "Credit Card",
                        "+91-9677889900", "rewards@sbi-cards-loyalty.online", "https://sbi-cards-loyalty.online",
                        "State Bank of India", "Punjab", "Chandigarh", 92, "CRITICAL", "EVIDENCE_REQUIRED"
                },
                {
                        "CR-INC-2026-000115", "CR-2026-000115", c3.getId(), c3.getName(), c3.getEmail(),
                        "ONLINE_HARASSMENT", "WhatsApp Video Extortion Blackmail",
                        "Received an unsolicited WhatsApp video call. Face recorded and morphed into explicit photos, followed by threats to circulate video to contacts unless Rs 15,000 was paid.",
                        "2026-09-04", "23:00", 0.0, "N/A", "N/A",
                        "+91-9811223399", "blackmail-handler@protonmail.com", "None",
                        "N/A", "Telangana", "Hyderabad", 75, "HIGH", "INVESTIGATION"
                }
        };

        for (Object[] d : incidentData) {
            String incId = (String) d[0];
            String caseId = (String) d[1];
            String userId = (String) d[2];
            String userName = (String) d[3];
            String userEmail = (String) d[4];
            String category = (String) d[5];
            String title = (String) d[6];
            String desc = (String) d[7];
            String date = (String) d[8];
            String time = (String) d[9];
            Double loss = (Double) d[10];
            String txnId = (String) d[11];
            String payMode = (String) d[12];
            String suspectPhone = (String) d[13];
            String suspectEmail = (String) d[14];
            String url = (String) d[15];
            String bank = (String) d[16];
            String state = (String) d[17];
            String district = (String) d[18];
            Integer riskScore = (Integer) d[19];
            String riskLevel = (String) d[20];
            String status = (String) d[21];

            List<String> indicators = List.of("Financial deception vector", "Electronic communication manipulation", "Identity or credential exposure");
            List<String> reasons = List.of(
                    String.format("Reported financial impact (Rs %,.2f)", loss),
                    "Direct suspect contact details identified",
                    "High-threat threat classification under " + category
            );
            List<String> actions = List.of(
                    "Call National Cyber Crime Helpline 1930 immediately.",
                    "Save transaction UTR and suspect phone number.",
                    "Block payment cards and notify your bank's fraud monitoring wing."
            );

            Incident incident = Incident.builder()
                    .incidentId(incId)
                    .userId(userId)
                    .complainantName(userName)
                    .complainantEmail(userEmail)
                    .category(category)
                    .title(title)
                    .description(desc)
                    .incidentDate(date)
                    .incidentTime(time)
                    .financialLoss(loss)
                    .transactionId(txnId)
                    .paymentMethod(payMode)
                    .suspectPhone(suspectPhone)
                    .suspectEmail(suspectEmail)
                    .suspiciousUrl(url)
                    .bankName(bank)
                    .state(state)
                    .district(district)
                    .classificationConfidence(0.92)
                    .riskScore(riskScore)
                    .riskLevel(riskLevel)
                    .indicators(indicators)
                    .riskReasons(reasons)
                    .recommendedActions(actions)
                    .status(status)
                    .createdAt(LocalDateTime.now().minusDays(18))
                    .updatedAt(LocalDateTime.now())
                    .build();

            incidentRepository.save(incident);

            List<CaseTimelineEvent> timeline = new ArrayList<>();
            timeline.add(CaseTimelineEvent.builder()
                    .stage("REPORT_SUBMITTED")
                    .title("Incident Submitted")
                    .description("Incident report lodged by " + userName)
                    .updatedBy(userName)
                    .timestamp(LocalDateTime.now().minusDays(18))
                    .build());
            timeline.add(CaseTimelineEvent.builder()
                    .stage("AI_CLASSIFIED")
                    .title("AI Classification Verified")
                    .description("Categorized as " + category + " with 92% confidence.")
                    .updatedBy("CyberRakshak AI")
                    .timestamp(LocalDateTime.now().minusDays(18).plusMinutes(2))
                    .build());
            timeline.add(CaseTimelineEvent.builder()
                    .stage("RISK_ASSESSED")
                    .title("Risk Score Evaluated")
                    .description(String.format("Assigned Risk Score: %d/100 (%s)", riskScore, riskLevel))
                    .updatedBy("Threat Scoring Engine")
                    .timestamp(LocalDateTime.now().minusDays(18).plusMinutes(5))
                    .build());

            if (!"SUBMITTED".equalsIgnoreCase(status)) {
                timeline.add(CaseTimelineEvent.builder()
                        .stage(status)
                        .title("Case Progressed: " + status)
                        .description("Case escalated to state cyber cell for investigation.")
                        .updatedBy("Inspector Vikram Rathore")
                        .timestamp(LocalDateTime.now().minusDays(5))
                        .build());
            }

            Case c = Case.builder()
                    .caseId(caseId)
                    .incidentId(incId)
                    .userId(userId)
                    .complainantName(userName)
                    .complainantEmail(userEmail)
                    .category(category)
                    .riskScore(riskScore)
                    .riskLevel(riskLevel)
                    .status(status)
                    .priority(riskLevel.equals("CRITICAL") ? "CRITICAL" : "HIGH")
                    .assignedOfficerId("OFFICER_01")
                    .assignedOfficerName("Inspector Vikram Rathore")
                    .timeline(timeline)
                    .officerNotes(List.of("Preliminary telemetry verified against 1930 CDR registry."))
                    .citizenActionChecklist(actions)
                    .createdAt(LocalDateTime.now().minusDays(18))
                    .updatedAt(LocalDateTime.now())
                    .build();

            caseRepository.save(c);
        }
    }

    private void seedUrlAnalyses() {
        Object[][] demoUrls = {
                {"http://sbi-kyc-verification.top/login", 100, "CRITICAL", false, "sbi-kyc-verification.top", List.of("Insecure HTTP", "Suspicious .top TLD", "Target brand 'sbi' spoofing")},
                {"https://hdfc-pan-update.online/auth", 90, "CRITICAL", true, "hdfc-pan-update.online", List.of("Unofficial domain using 'hdfc' name", "Sensitive path /auth")},
                {"http://free-iphone15-giveaway.club/claim", 85, "HIGH", false, "free-iphone15-giveaway.club", List.of("High risk TLD .club", "Prize/lottery trap path")},
                {"https://cybercrime.gov.in", 10, "LOW", true, "cybercrime.gov.in", List.of("Official Indian Government .gov.in domain", "Valid HTTPS encryption")},
                {"https://sancharsaathi.gov.in", 10, "LOW", true, "sancharsaathi.gov.in", List.of("Official DoT Government portal", "Valid SSL certificate")}
        };

        for (int i = 0; i < demoUrls.length; i++) {
            Object[] u = demoUrls[i];
            UrlAnalysis scan = UrlAnalysis.builder()
                    .scanId(String.format("SCAN-2026-%06d", 1000 + i))
                    .userId("SYSTEM")
                    .url((String) u[0])
                    .score((Integer) u[1])
                    .riskLevel((String) u[2])
                    .isSecureHttps((Boolean) u[3])
                    .domain((String) u[4])
                    .findings((List<String>) u[5])
                    .recommendation((Integer) u[1] >= 50 ? "DO NOT enter credentials or download files." : "Verified secure domain.")
                    .createdAt(LocalDateTime.now().minusDays(i + 1))
                    .build();
            urlAnalysisRepository.save(scan);
        }
    }

    private void seedAwarenessArticles() {
        AwarenessArticle a1 = AwarenessArticle.builder()
                .category("UPI_SAFETY")
                .title("The QR Code Scam: Why You Never Enter a PIN to Receive Money")
                .slug("upi-qr-code-scam-guide")
                .summary("Learn how scammers exploit misconceptions about UPI QR codes to empty bank accounts.")
                .content("One of the most widespread scams in India targets sellers on OLX, Facebook Marketplace, and small merchants. The scammer sends a QR code claiming 'Scan this to receive your advance payment'. Remember: UPI PIN is ONLY needed for sending money or checking balance, NEVER for receiving money.")
                .warningSigns(List.of(
                        "Buyer insists on paying only via QR code before meeting",
                        "QR code displays a negative amount or 'Pay' prompt instead of receive",
                        "Caller claims entering UPI PIN will verify your account"
                ))
                .dos(List.of(
                        "Always ask the buyer to use standard UPI mobile number or VPA",
                        "Verify money received in your banking app before handing over goods"
                ))
                .donts(List.of(
                        "Never enter your UPI PIN on any screen asking you to 'claim money'",
                        "Never share payment confirmation screenshots showing account numbers"
                ))
                .officialHelplines(List.of("National Cyber Helpline: 1930", "NPCI Dispute Portal: upi.npci.org.in"))
                .publishedAt(LocalDateTime.now().minusDays(10))
                .build();

        AwarenessArticle a2 = AwarenessArticle.builder()
                .category("PHISHING")
                .title("Spotting Fake Bank KYC & Electricity Disconnection SMS")
                .slug("phishing-bank-kyc-electricity-guide")
                .summary("How to recognize spoofed SMS headers and malicious short links disguised as official bank warnings.")
                .content("Scammers use bulk SMS senders with spoofed sender headers to claim your electricity will be disconnected tonight or your bank account has been suspended for KYC. They urge you to click a link ending in .xyz, .top, or bit.ly. Official banks and electricity discoms will never send short links for urgent disconnection.")
                .warningSigns(List.of(
                        "Threat of urgent disconnection or account closure within hours",
                        "Links containing unofficial domain names or raw IP addresses",
                        "Requests to download AnyDesk or TeamViewer screen-sharing software"
                ))
                .dos(List.of(
                        "Report suspicious sender mobile numbers to Chakshu at sancharsaathi.gov.in",
                        "Contact your bank directly via the customer care number on the back of your debit card"
                ))
                .donts(List.of(
                        "Never click on links received via unsolicited SMS",
                        "Never allow remote desktop access to an unknown caller"
                ))
                .officialHelplines(List.of("Chakshu Portal: sancharsaathi.gov.in", "Cyber Helpline: 1930"))
                .publishedAt(LocalDateTime.now().minusDays(12))
                .build();

        AwarenessArticle a3 = AwarenessArticle.builder()
                .category("JOB_SCAMS")
                .title("Telegram Part-Time Task Scams: The YouTube Like Trap")
                .slug("telegram-part-time-job-scam")
                .summary("Understanding task-based prepaid recruitment fraud promising daily income of Rs 5,000+.")
                .content("Victims are contacted on WhatsApp with offers of flexible work-from-home tasks like rating hotels or liking YouTube clips. After small initial payouts (Rs 150-300) to build trust, victims are shifted to Telegram VIP groups and coerced to pay 'prepaid investment tasks' of Rs 5,000 to Rs 2,00,000 which can never be withdrawn.")
                .warningSigns(List.of(
                        "Unsolicited job offers from international numbers (+62, +84, +234)",
                        "Demands for advance registration fees or cryptocurrency deposits",
                        "Pressure from group 'mentors' claiming you will lose profits if you don't recharge"
                ))
                .dos(List.of(
                        "Verify legitimate recruitment channels on company career portals",
                        "Preserve complete chat exports and bank beneficiary accounts"
                ))
                .donts(List.of(
                        "Never deposit personal savings into task-based investment schemes",
                        "Never share Aadhaar card or cancelled cheques with unverified recruiters"
                ))
                .officialHelplines(List.of("National Cybercrime Reporting Portal: cybercrime.gov.in"))
                .publishedAt(LocalDateTime.now().minusDays(8))
                .build();

        awarenessRepository.saveAll(List.of(a1, a2, a3));
    }

    private void seedAuditLogs() {
        AuditLog l1 = AuditLog.builder()
                .actorId("ADMIN_01")
                .actorEmail("admin@cyberrakshak.in")
                .actorRole("ROLE_ADMIN")
                .action("SYSTEM_INITIALIZATION")
                .resource("SYSTEM")
                .resourceId("SYS-START")
                .details("CyberRakshak Incident Response Database seeded and verified.")
                .ipAddress("127.0.0.1")
                .timestamp(LocalDateTime.now().minusDays(30))
                .build();

        AuditLog l2 = AuditLog.builder()
                .actorId("OFFICER_01")
                .actorEmail("vikram.rathore@cyberrakshak.in")
                .actorRole("ROLE_OFFICER")
                .action("ADMIN_UPDATED_CASE_STATUS")
                .resource("CASE")
                .resourceId("CR-2026-000102")
                .previousValue("SUBMITTED")
                .newValue("INVESTIGATION")
                .details("Telemetry verified with bank nodal officer. Beneficiary freeze request dispatched.")
                .ipAddress("192.168.1.15")
                .timestamp(LocalDateTime.now().minusDays(15))
                .build();

        AuditLog l3 = AuditLog.builder()
                .actorId("ADMIN_01")
                .actorEmail("admin@cyberrakshak.in")
                .actorRole("ROLE_ADMIN")
                .action("ADMIN_ASSIGNED_CASE")
                .resource("CASE")
                .resourceId("CR-2026-000103")
                .previousValue("UNASSIGNED")
                .newValue("Inspector Vikram Rathore")
                .details("Case assigned for priority financial tracing.")
                .ipAddress("127.0.0.1")
                .timestamp(LocalDateTime.now().minusDays(14))
                .build();

        auditLogRepository.saveAll(List.of(l1, l2, l3));
    }
}
