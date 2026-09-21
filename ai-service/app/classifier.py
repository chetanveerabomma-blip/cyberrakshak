import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from typing import Dict, Any, List
from .preprocessing import clean_text, extract_indicators

# Comprehensive synthetic training set representing real Indian cybercrime scenarios
TRAINING_DATA = [
    # UPI Scam
    ("The seller asked me to scan a QR code to receive payment on PhonePe, but when I entered my UPI PIN money was debited instead.", "UPI_SCAM"),
    ("Received an SMS saying money was wrongly credited to my GPay account, fraudster asked to send it back via UPI link.", "UPI_SCAM"),
    ("I listed my sofa on OLX, buyer sent a QR code stating 'Scan to receive 15000 INR'. It deducted money from my SBI account.", "UPI_SCAM"),
    ("Fraudulent VPA asked for payment request on BHIM app masquerading as electricity bill clearance.", "UPI_SCAM"),
    ("Scammer sent a fake payment screenshot and pressurized me to transfer refund via Google Pay immediately.", "UPI_SCAM"),
    
    # Phishing
    ("Got an SMS from AD-HDFCBK stating 'Dear Customer, your bank account is suspended. Update PAN immediately at bit.ly/hdfc-pan-update'.", "PHISHING"),
    ("Received an email looking exactly like Netflix saying payment failed. Clicked the link and entered credit card details.", "PHISHING"),
    ("Link received on WhatsApp claiming free recharge of 3 months from Jio/Airtel if I fill my personal details on jio-recharge.xyz.", "PHISHING"),
    ("Fake income tax refund notice received via email asking to login through a suspicious portal to claim Rs 42,000.", "PHISHING"),
    ("Received message that electricity will be disconnected tonight at 9:30 PM due to unpaid bill, click this link to verify.", "PHISHING"),
    
    # Fake Job
    ("Offered a part time work from home job on Telegram to like YouTube videos for 50 rupees each, later asked to deposit money for VIP tasks.", "FAKE_JOB"),
    ("Received message on WhatsApp offering remote data entry job, asked for registration fee of 3500 rupees and then blocked me.", "FAKE_JOB"),
    ("Recruiter claimed to be from Amazon HR, sent fake offer letter and demanded training kit fee of 12,000 INR.", "FAKE_JOB"),
    ("Telegram group promising daily earning of 10,000 by reviewing Google maps locations, lost 80,000 in crypto deposit tasks.", "FAKE_JOB"),
    ("Job portal scammer took money for interview scheduling and background verification at airline company.", "FAKE_JOB"),

    # Fake Shopping
    ("Ordered a winter jacket from an Instagram page offering 80% discount. Paid 1,499 via UPI, page vanished and package never arrived.", "FAKE_SHOPPING"),
    ("Website named bestdealelectronics.shop offered iPhone 15 for Rs 19,999. Transferred money, no order confirmation or tracking.", "FAKE_SHOPPING"),
    ("Saw a sponsored Facebook ad for cheap shoes. Paid online, seller phone number is switched off.", "FAKE_SHOPPING"),
    ("Duplicate website imitating Zara clothing store took card payment but never dispatched goods.", "FAKE_SHOPPING"),

    # Account Takeover
    ("Someone gained access to my Gmail account, changed the 2FA phone number and recovery email, and locked me out.", "ACCOUNT_TAKEOVER"),
    ("My Instagram profile was hacked, hacker changed the email and is posting crypto scams to all my followers.", "ACCOUNT_TAKEOVER"),
    ("Received unexpected password reset notifications, then lost access to my WhatsApp and Facebook accounts.", "ACCOUNT_TAKEOVER"),
    ("Sim swap fraud: my SIM card suddenly showed No Service, and attacker logged into my bank netbanking account.", "ACCOUNT_TAKEOVER"),

    # Social Media Fraud
    ("Friend's Instagram account was cloned with their profile picture, imposter asked me for urgent 5000 INR emergency medical loan.", "SOCIAL_MEDIA_FRAUD"),
    ("Fake profile of a police officer or military personnel selling a car on Facebook Marketplace for cheap transfer.", "SOCIAL_MEDIA_FRAUD"),
    ("Someone is using my photos to create fake explicit profiles and extorting money on WhatsApp.", "SOCIAL_MEDIA_FRAUD"),
    ("Romance scammer met on dating app claiming to send expensive gift from UK stuck at customs requiring clearance fees.", "SOCIAL_MEDIA_FRAUD"),

    # OTP Fraud
    ("Caller claiming to be SBI bank manager asked for 6-digit OTP to prevent debit card deactivation.", "OTP_FRAUD"),
    ("Shared an SMS code with a delivery boy who claimed it was for parcel verification, money got debited immediately.", "OTP_FRAUD"),
    ("Fraudster convinced me to forward an SMS containing my WhatsApp verification code and hijacked my chat account.", "OTP_FRAUD"),
    ("Bank caller insisted on reading out the OTP sent to my phone for Aadhaar-PAN card linking.", "OTP_FRAUD"),

    # Investment Scam
    ("Joined a WhatsApp stock trading group where admin guaranteed 300% weekly returns on institutional crypto trading app.", "INVESTMENT_SCAM"),
    ("Invested 2 lakhs on a bogus trading platform showing fake profits, but they demand 30% tax fee to withdraw any money.", "INVESTMENT_SCAM"),
    ("Ponzi forex trading scheme through Telegram bot promising automated daily profits with binary options.", "INVESTMENT_SCAM"),
    ("Peer to peer crypto arbitrage scheme persuaded victim to deposit USDT on unverified exchange website.", "INVESTMENT_SCAM"),

    # Identity Theft
    ("Found out someone took a personal loan of 50,000 INR using my stolen PAN and Aadhaar card details on an instant loan app.", "IDENTITY_THEFT"),
    ("Someone opened multiple fake bank accounts and issued SIM cards in my name without my authorization.", "IDENTITY_THEFT"),
    ("Received legal recovery notices for micro loans I never applied for, my KYC documents were leaked.", "IDENTITY_THEFT"),

    # Malware
    ("Downloaded an APK file named 'PM_Kisan_Yojana.apk' sent on WhatsApp, phone started auto-forwarding SMS and heating up.", "MALWARE"),
    ("Victim was instructed to install AnyDesk and TeamViewer QuickSupport app on mobile by a fake customer support agent.", "MALWARE"),
    ("Laptop files encrypted with ransom note demanding payment in Bitcoin, computer blocked with locker virus.", "MALWARE")
]

RECOMMENDED_ACTIONS = {
    "UPI_SCAM": [
        "Immediately call your bank customer care or helpline 1930 to freeze the transaction.",
        "File a dispute in your UPI app (Google Pay / PhonePe / Paytm / BHIM) under 'Unauthorized Debit'.",
        "Save the transaction UTR number, UPI ID of recipient, and screenshots of payment confirmation.",
        "Never scan a QR code or enter your UPI PIN to 'receive' money — PIN is only required to SEND money."
    ],
    "PHISHING": [
        "Do not click any more links or enter credentials on the suspicious page.",
        "Immediately change your net banking, email, or social media passwords from a secure device.",
        "Enable Two-Factor Authentication (2FA/MFA) using an Authenticator app instead of plain SMS.",
        "Report the phishing SMS / sender number to Chakshu portal (sancharsaathi.gov.in) and 1930."
    ],
    "FAKE_JOB": [
        "Cease all communication with the fraudulent recruiters immediately.",
        "Do not deposit any 'security deposits', 'VIP task upgrades', or 'crypto balances'.",
        "Export and preserve the entire chat log, recruiter phone numbers, and payment bank account details.",
        "Report the recruiter profile and payment receiver account details on the cybercrime portal."
    ],
    "FAKE_SHOPPING": [
        "Contact your bank or card issuer immediately to initiate a chargeback / transaction recall.",
        "Preserve receipts, payment order IDs, website URL, and communications with the fraudulent store.",
        "Verify domain registration date and company details before future purchases.",
        "Report the fraudulent Instagram/Facebook page or website."
    ],
    "ACCOUNT_TAKEOVER": [
        "Initiate official account recovery via the service provider's emergency recovery portal.",
        "Revoke all active sessions and trusted devices from account settings.",
        "If SIM swap is suspected (No Service), immediately visit your telecom operator store with ID proof.",
        "Alert friends and family not to respond to emergency requests sent from your compromised accounts."
    ],
    "SOCIAL_MEDIA_FRAUD": [
        "Report the impersonating or fake profile directly to the social media platform with original proof.",
        "Post a public notice on your verified profile warning contacts not to send funds or click links.",
        "Do not pay any extortion or blackmail demands — preserve all messages as evidence.",
        "Contact 1930 or local cyber police if harassment or extortion is involved."
    ],
    "OTP_FRAUD": [
        "Instantly call your bank's emergency debit/credit card blocking helpline.",
        "Lock your net banking access and report unauthorized transactions within the 24-hour golden window.",
        "Remember: Legitimate bank officials never ask for OTP, CVV, or passwords over call.",
        "File an incident report on cybercrime.gov.in with bank account statement."
    ],
    "INVESTMENT_SCAM": [
        "Do not pay any 'withdrawal tax', 'customs fee', or 'platform clearance fee' — it is a secondary trap.",
        "Preserve transaction hashes, bank transfer receipts, and group admin phone numbers.",
        "Report the fraudulent investment app/website to SEBI and the National Cybercrime Reporting Portal.",
        "Check bank accounts used for deposits and request freeze via cyber cell."
    ],
    "IDENTITY_THEFT": [
        "Check your CIBIL / Experian credit report to identify unauthorized loan accounts or inquiries.",
        "File an FIR / police report stating misuse of Aadhaar/PAN cards.",
        "Lock your Aadhaar biometrics online using the official UIDAI mAadhaar portal.",
        "Notify the fraud department of the financial institutions where unauthorized loans were opened."
    ],
    "MALWARE": [
        "Disconnect your device from Wi-Fi, mobile data, and Bluetooth immediately (turn on Airplane mode).",
        "Uninstall the suspicious APK/app or screen-sharing application (AnyDesk/TeamViewer).",
        "Perform a full factory reset of the mobile/computer if unauthorized remote access was established.",
        "Change all critical banking and email passwords from an entirely separate, clean device."
    ],
    "OTHER": [
        "Preserve all digital evidence including screenshots, chat histories, emails, and transaction numbers.",
        "Call the National Cybercrime Helpline 1930 for immediate advisory assistance.",
        "Avoid engaging further with suspicious contacts or sharing additional personal data."
    ]
}

class ScamClassifier:
    def __init__(self):
        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2), max_features=3000, stop_words='english')),
            ('clf', MultinomialNB(alpha=0.1))
        ])
        self._train()

    def _train(self):
        texts = [item[0] for item in TRAINING_DATA]
        labels = [item[1] for item in TRAINING_DATA]
        self.pipeline.fit(texts, labels)

    def predict(self, text: str) -> Dict[str, Any]:
        cleaned = clean_text(text)
        if not cleaned or len(cleaned.strip()) < 5:
            return {
                "category": "OTHER",
                "confidence": 0.50,
                "riskLevel": "LOW",
                "indicators": ["Insufficient narrative detail provided"],
                "recommendedActions": RECOMMENDED_ACTIONS["OTHER"]
            }

        probs = self.pipeline.predict_proba([cleaned])[0]
        classes = self.pipeline.classes_
        top_idx = int(np.argmax(probs))
        category = classes[top_idx]
        confidence = float(probs[top_idx])

        # Heuristic boost for clear fraud signals
        lowered = cleaned.lower()
        if any(w in lowered for w in ["upi pin", "qr code", "phonepe", "gpay", "bhim", "vpa"]):
            category = "UPI_SCAM"
            confidence = max(confidence, 0.91)
        elif any(w in lowered for w in ["apk", "anydesk", "teamviewer", "malware", "virus", "ransomware"]):
            category = "MALWARE"
            confidence = max(confidence, 0.94)
        elif any(w in lowered for w in ["telegram task", "like youtube", "part time job", "daily income", "work from home"]):
            category = "FAKE_JOB"
            confidence = max(confidence, 0.93)
        elif any(w in lowered for w in ["trading group", "guaranteed return", "crypto profit", "usdt", "forex bot"]):
            category = "INVESTMENT_SCAM"
            confidence = max(confidence, 0.90)
        elif any(w in lowered for w in ["otp", "one time password", "cvv", "card deactivation"]):
            category = "OTP_FRAUD"
            confidence = max(confidence, 0.95)

        # Risk level assessment based on category and financial indicators
        risk_level = "HIGH"
        if category in ["MALWARE", "OTP_FRAUD", "INVESTMENT_SCAM"]:
            risk_level = "CRITICAL"
        elif category in ["UPI_SCAM", "ACCOUNT_TAKEOVER", "IDENTITY_THEFT"]:
            risk_level = "HIGH"
        elif category in ["FAKE_JOB", "PHISHING", "FAKE_SHOPPING"]:
            risk_level = "HIGH" if ("paid" in lowered or "rupees" in lowered or "loss" in lowered or "debit" in lowered) else "MEDIUM"
        else:
            risk_level = "MEDIUM"

        indicators = extract_indicators(cleaned)
        recommended = RECOMMENDED_ACTIONS.get(category, RECOMMENDED_ACTIONS["OTHER"])

        return {
            "category": category,
            "confidence": round(confidence, 2),
            "riskLevel": risk_level,
            "indicators": indicators,
            "recommendedActions": recommended
        }

classifier_instance = ScamClassifier()
