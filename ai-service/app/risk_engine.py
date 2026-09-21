from typing import Dict, Any, List

def calculate_incident_risk(
    category: str,
    description: str,
    financial_loss: float = 0.0,
    has_otp: bool = False,
    has_url: bool = False,
    has_apk: bool = False
) -> Dict[str, Any]:
    score = 15  # Base incident risk
    reasons: List[str] = []
    
    desc_lower = (description or "").lower()
    
    # Financial loss calculation
    if financial_loss > 100000:
        score += 30
        reasons.append(f"Substantial financial loss reported (Rs {financial_loss:,.2f})")
    elif financial_loss > 10000:
        score += 25
        reasons.append(f"Direct financial loss reported (Rs {financial_loss:,.2f})")
    elif financial_loss > 0:
        score += 15
        reasons.append(f"Monetary loss involved (Rs {financial_loss:,.2f})")
        
    # OTP / Credential disclosure
    if has_otp or any(w in desc_lower for w in ["otp", "one time password", "cvv", "pin"]):
        score += 25
        reasons.append("Critical authentication credential (OTP / PIN / CVV) compromise detected")
        
    # Banking or Netbanking context
    if any(w in desc_lower for w in ["bank", "sbi", "hdfc", "icici", "netbanking", "debit card", "credit card", "upi pin"]):
        score += 20
        reasons.append("Banking infrastructure / payment gateway exposure")

    # Malicious link / APK download
    if has_apk or any(w in desc_lower for w in [".apk", "anydesk", "teamviewer", "quicksupport", "remote access"]):
        score += 30
        reasons.append("Device takeover or malicious APK installation detected")
    elif has_url or any(w in desc_lower for w in ["http://", "https://", "link", "website"]):
        score += 15
        reasons.append("Suspicious hyperlink used as scam vector")

    # High pressure or digital arrest threat
    if any(w in desc_lower for w in ["police", "cbi", "arrest", "customs", "narcotics", "warrant", "urgent"]):
        score += 20
        reasons.append("Psychological coercion / fake legal authority impersonation detected")

    # Category weight
    category_weights = {
        "MALWARE": 25,
        "OTP_FRAUD": 25,
        "ACCOUNT_TAKEOVER": 20,
        "INVESTMENT_SCAM": 20,
        "UPI_SCAM": 18,
        "IDENTITY_THEFT": 18,
        "PHISHING": 15,
        "FAKE_JOB": 12,
        "SOCIAL_MEDIA_FRAUD": 10,
        "FAKE_SHOPPING": 10,
        "ONLINE_HARASSMENT": 12,
        "OTHER": 5
    }
    score += category_weights.get(category, 10)

    score = max(10, min(score, 100))

    if score >= 75:
        risk_level = "CRITICAL"
    elif score >= 50:
        risk_level = "HIGH"
    elif score >= 25:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    if not reasons:
        reasons.append("Standard threat indicators assessed from incident report")

    return {
        "riskScore": score,
        "riskLevel": risk_level,
        "reasons": reasons
    }
