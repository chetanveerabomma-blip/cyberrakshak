from typing import Dict, Any

KNOWLEDGE_RESPONSES = [
    {
        "keywords": ["upi", "qr code", "phonepe", "gpay", "paytm", "bhim", "wrongly credited"],
        "answer": (
            "🛡️ **Immediate Steps for UPI / QR Code Fraud:**\n\n"
            "1. **Never enter UPI PIN to receive money**: UPI PIN is only needed to transfer money out. Receiving money requires zero authorization.\n"
            "2. **Call Helpline 1930 immediately**: Report the unauthorized debit within the 'Golden Hour' (within 2-3 hours) so the cyber cell can freeze beneficiary accounts.\n"
            "3. **Raise a dispute in your UPI app**: Go to the transaction details in GPay/PhonePe/Paytm and select 'Raise Dispute' or 'Report Fraud'.\n"
            "4. **Preserve Transaction ID (UTR)**: Note the 12-digit UTR reference number and the recipient's VPA / UPI ID.\n"
            "5. **File on Cybercrime Portal**: Register the complaint officially at [cybercrime.gov.in](https://cybercrime.gov.in) with your bank statement."
        )
    },
    {
        "keywords": ["phishing", "clicked link", "fake link", "sms link", "pan update", "electricity bill"],
        "answer": (
            "⚠️ **If you clicked a suspicious link or phishing site:**\n\n"
            "1. **Do NOT submit credentials or OTPs**: If the page is still open, close it and clear your browser cache.\n"
            "2. **Change Passwords Immediately**: From a trusted device, change passwords for net banking, email, and social accounts.\n"
            "3. **Enable 2FA / MFA**: Activate Two-Factor Authentication via an Authenticator app (e.g. Google Authenticator).\n"
            "4. **Report Suspicious SMS / Number**: Use the **Chakshu portal** on [sancharsaathi.gov.in](https://sancharsaathi.gov.in) to flag suspected fraud communication."
        )
    },
    {
        "keywords": ["otp", "cvv", "shared otp", "bank manager call", "card blocked"],
        "answer": (
            "🚨 **Critical Action: OTP Shared with Scammer:**\n\n"
            "1. **Block Debit/Credit Cards immediately**: Call your bank's toll-free emergency card blocking number or use your official mobile banking app to freeze cards.\n"
            "2. **Lock Netbanking**: Trigger wrong password attempts or use NetBanking security lock features.\n"
            "3. **Call 1930 Cyber Helpline**: State that OTP was compromised to request an immediate freeze on the outbound transfer.\n"
            "4. **Remember**: No bank or police officer will ever ask you for an OTP or PIN over phone."
        )
    },
    {
        "keywords": ["job", "part time", "telegram", "youtube like", "work from home", "task"],
        "answer": (
            "💼 **Advisory on Part-Time / Telegram Job Scams:**\n\n"
            "1. **Stop Paying Any Money**: Legitimate companies will NEVER ask you to deposit money, buy crypto, or pay for VIP tasks.\n"
            "2. **Export Chat History**: Before they delete messages, take complete screenshots of the Telegram/WhatsApp chat and admin usernames.\n"
            "3. **Record Bank Accounts**: Note down the Indian bank accounts and names they instructed you to transfer funds to.\n"
            "4. **File Cybercrime Complaint**: Lodge a complaint under 'Financial Fraud / Job Scam' on cybercrime.gov.in."
        )
    },
    {
        "keywords": ["digital arrest", "cbi", "police", "customs", "parcel", "narcotics", "skype call"],
        "answer": (
            "⚖️ **Important Advisory on 'Digital Arrest' & Law Enforcement Impersonation:**\n\n"
            "1. **There is NO legal concept of 'Digital Arrest'**: Neither the Indian Police, CBI, ED, nor Customs ever arrest anyone over Skype, WhatsApp, or video calls.\n"
            "2. **Do Not Transfer Any 'Security Clearance' Funds**: Law enforcement agencies never demand money transfers to verify your innocence.\n"
            "3. **Disconnect the Call**: Hang up immediately and do not panic.\n"
            "4. **Report Immediately**: Dial 1930 or visit your local police station."
        )
    },
    {
        "keywords": ["hacked", "instagram", "facebook", "gmail", "account takeover", "locked out"],
        "answer": (
            "🔐 **Steps for Compromised / Hacked Account Recovery:**\n\n"
            "1. **Use Official Recovery Channels**: Visit the service's recovery portal (e.g. instagram.com/hacked or accounts.google.com/recovery).\n"
            "2. **Revoke Active Sessions**: If you still have temporary access, navigate to Security settings and click 'Log out of all devices'.\n"
            "3. **Check Recovery Contact Info**: Ensure the hacker didn't substitute their email address or phone number.\n"
            "4. **Notify Contacts**: Post an alert through alternative channels telling friends not to send money to requests coming from your handle."
        )
    }
]

DEFAULT_ANSWER = (
    "🛡️ **CyberRakshak Advisory:**\n\n"
    "If you have experienced a cybercrime incident in India:\n"
    "• **Immediate Financial Emergency**: Call the National Cyber Helpline **1930** (available 24/7) within the golden hour to freeze stolen funds.\n"
    "• **Official Complaint**: File an official report at the National Cyber Crime Reporting Portal at **[cybercrime.gov.in](https://cybercrime.gov.in)**.\n"
    "• **Preserve Evidence**: Save all transaction IDs (UTR numbers), chat screenshots, phone numbers, and payment links.\n"
    "• **Report Suspected Fraud Numbers**: Visit **[sancharsaathi.gov.in](https://sancharsaathi.gov.in)** to report fraudulent mobile numbers on the Chakshu portal.\n\n"
    "*(Disclaimer: CyberRakshak provides incident assistance and evidence preparation; it does not replace official police or bank investigations.)*"
)

def get_assistant_response(query: str) -> Dict[str, Any]:
    q = (query or "").lower().strip()
    for item in KNOWLEDGE_RESPONSES:
        if any(kw in q for kw in item["keywords"]):
            return {"response": item["answer"]}
    return {"response": DEFAULT_ANSWER}
