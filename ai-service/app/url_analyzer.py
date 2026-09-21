import re
from urllib.parse import urlparse
from typing import Dict, Any, List

SUSPICIOUS_TLDS = {
    ".top", ".xyz", ".club", ".buzz", ".work", ".click", ".gq", ".cf", ".ml", ".ga",
    ".ru", ".icu", ".rest", ".online", ".site", ".live", ".cc", ".link", ".bar"
}

SUSPICIOUS_PATH_KEYWORDS = [
    "login", "signin", "verify", "verification", "kyc", "update", "banking", "secure",
    "account", "bonus", "reward", "lottery", "claim", "recharge", "aadhaar", "pan-link",
    "support", "free", "gift", "refund", "upi", "pay"
]

HIGH_PROFILE_TARGETS = [
    "sbi", "hdfc", "icici", "axis", "pnb", "bob", "paytm", "phonepe", "gpay", "google",
    "netflix", "amazon", "flipkart", "uidai", "incometax", "jio", "airtel", "irctc"
]

def analyze_url(raw_url: str) -> Dict[str, Any]:
    url = raw_url.strip()
    if not url.startswith(("http://", "https://")):
        url = "http://" + url  # default scheme for parsing

    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    path = parsed.path or ""
    query = parsed.query or ""
    
    score = 10  # base starting score
    findings: List[str] = []
    
    # Check 1: HTTPS usage
    if parsed.scheme != "https":
        score += 25
        findings.append("Insecure connection (HTTP without SSL/TLS encryption)")
    else:
        findings.append("Encrypted connection (HTTPS detected)")

    # Check 2: IP address used instead of domain name
    ip_pattern = r"^(\d{1,3}\.){3}\d{1,3}$"
    if re.match(ip_pattern, hostname):
        score += 45
        findings.append("Raw numeric IP address used instead of legitimate domain name")

    # Check 3: Suspicious top-level domain (TLD)
    matched_tld = None
    for tld in SUSPICIOUS_TLDS:
        if hostname.endswith(tld):
            matched_tld = tld
            break
    if matched_tld:
        score += 25
        findings.append(f"High-risk Top Level Domain detected: '{matched_tld}' frequently abused in phishing")

    # Check 4: Punycode / IDN homograph attack
    if "xn--" in hostname:
        score += 35
        findings.append("Punycode / Homograph domain characters detected (possible visual impersonation)")

    # Check 5: Excessive subdomains (domain nesting)
    subdomains = hostname.split(".")
    if len(subdomains) > 3:
        score += 15
        findings.append(f"Excessive subdomain depth ({len(subdomains)} levels) used to mask real origin")

    # Check 6: Brand keyword impersonation in non-official domain
    brand_hit = None
    for brand in HIGH_PROFILE_TARGETS:
        if brand in hostname:
            # Check if it's really the official domain
            official_domains = [f"{brand}.com", f"{brand}.co.in", f"{brand}.gov.in", f"{brand}.in"]
            if not any(hostname == off or hostname.endswith("." + off) for off in official_domains):
                brand_hit = brand
                break
    if brand_hit:
        score += 35
        findings.append(f"Target brand keyword '{brand_hit}' detected in unofficial domain name")

    # Check 7: Suspicious action/phishing keywords in URL path or query
    full_path_query = (path + " " + query).lower()
    found_keywords = [kw for kw in SUSPICIOUS_PATH_KEYWORDS if kw in full_path_query]
    if found_keywords:
        score += min(len(found_keywords) * 10, 25)
        findings.append(f"Phishing-associated path keywords found: {', '.join(found_keywords[:4])}")

    # Check 8: Excessive URL length
    if len(url) > 90:
        score += 10
        findings.append("Unusually long URL length (>90 characters) common in redirection disguises")

    # Check 9: Dangerous downloadable extensions
    if any(path.lower().endswith(ext) for ext in [".apk", ".exe", ".bat", ".scr", ".vbs"]):
        score += 40
        findings.append("Direct download link for executable or Android package (.apk) detected")

    # Normalize score between 0 and 100
    score = max(5, min(score, 100))

    if score >= 75:
        risk_level = "CRITICAL"
    elif score >= 50:
        risk_level = "HIGH"
    elif score >= 25:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        "url": raw_url,
        "score": score,
        "riskLevel": risk_level,
        "findings": findings,
        "isSecureHttps": parsed.scheme == "https",
        "domain": hostname,
        "recommendation": (
            "DO NOT open this link, download files, or enter any credentials or OTPs."
            if score >= 50 else
            "Proceed with standard caution. Verify the sender and never share sensitive credentials."
        )
    }
