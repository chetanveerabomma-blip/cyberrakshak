import re
from typing import List, Dict, Any

# Threat indicator regex patterns specific to Indian & global cyber fraud
INDICATOR_PATTERNS: Dict[str, List[str]] = {
    "Urgent payment or refund request": [
        r"\b(urgent|immediate|refund|reverse|fast|hurry|freeze|blocked|cancelled)\b",
        r"\b(send back|credit back|pay now|claim refund)\b"
    ],
    "UPI / QR code manipulation": [
        r"\b(upi|qr\s*code|scan|gpay|google\s*pay|phonepe|paytm|bhim|vpa|@upi|@okhdfcbank)\b",
        r"\b(enter pin to receive|scan to receive money)\b"
    ],
    "OTP / Banking credential request": [
        r"\b(otp|one\s*time\s*password|cvv|expiry|card\s*number|net\s*banking|debit\s*card|atm\s*pin|password)\b",
        r"\b(share otp|forward message|sms received)\b"
    ],
    "Suspicious link or unverified APK": [
        r"\b(https?://|www\.|\.apk|\.xyz|\.top|\.club|\.online|tinyurl|bit\.ly|shorturl)\b",
        r"\b(download app|install apk|anydesk|teamviewer|rustdesk|quicksupport)\b"
    ],
    "Fake job or task-based investment": [
        r"\b(work\s*from\s*home|part\s*time\s*job|telegram\s*task|like\s*youtube|crypto|daily\s*income|earn\s*(5000|10000|lakh))\b",
        r"\b(guaranteed\s*returns|vip\s*group|investment\s*scheme)\b"
    ],
    "Fake authority or legal threat impersonation": [
        r"\b(police|cbi|customs|cyber\s*cell|fedex|trai|narcotics|digital\s*arrest|arrest\s*warrant|court\s*order)\b",
        r"\b(money\s*laundering|terror\s*funding|illegal\s*parcel)\b"
    ],
    "Identity & KYC verification trap": [
        r"\b(kyc|aadhaar|pan\s*card|sim\s*block|electricity\s*bill\s*unpaid|power\s*cut)\b",
        r"\b(update\s*kyc|link\s*pan|verify\s*identity)\b"
    ],
    "Fake shopping or prize scam": [
        r"\b(won\s*a\s*car|lucky\s*draw|lottery|iphone\s*for\s*(999|499)|free\s*gift|mega\s*sale)\b"
    ]
}

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    # Normalize whitespaces
    text = re.sub(r"\s+", " ", text).strip()
    return text

def extract_indicators(text: str) -> List[str]:
    cleaned = clean_text(text)
    detected: List[str] = []
    
    for indicator_name, patterns in INDICATOR_PATTERNS.items():
        for pat in patterns:
            if re.search(pat, cleaned, re.IGNORECASE):
                detected.append(indicator_name)
                break
                
    if not detected:
        detected.append("General cyber incident narrative reported")
        
    return detected
