from app.classifier import classifier_instance
from app.url_analyzer import analyze_url
from app.risk_engine import calculate_incident_risk

print("Testing Classifier:")
res = classifier_instance.predict("I received an SMS to click link and enter OTP for bank refund")
print(res)

print("\nTesting URL Analyzer:")
url_res = analyze_url("http://sbi-kyc-verification.top/login.php?user=victim")
print(url_res)

print("\nTesting Risk Engine:")
risk_res = calculate_incident_risk(
    category=res["category"],
    description="I received an SMS to click link and enter OTP for bank refund",
    financial_loss=45000,
    has_otp=True,
    has_url=True
)
print(risk_res)
