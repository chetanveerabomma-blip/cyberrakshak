from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from .classifier import classifier_instance
from .url_analyzer import analyze_url
from .risk_engine import calculate_incident_risk
from .assistant import get_assistant_response
from .preprocessing import extract_indicators

app = FastAPI(
    title="CyberRakshak AI / NLP Microservice",
    description="Intelligent Scam Classification, Suspicious URL Analysis, Threat Scoring and Incident Guidance",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextClassificationRequest(BaseModel):
    text: str = Field(..., description="Incident description text or scam message")

class UrlAnalysisRequest(BaseModel):
    url: str = Field(..., description="URL to analyze")

class RiskScoreRequest(BaseModel):
    category: str = Field(..., description="Scam/Incident category")
    description: str = Field(..., description="Narrative description")
    financialLoss: Optional[float] = 0.0
    hasOtp: Optional[bool] = False
    hasUrl: Optional[bool] = False
    hasApk: Optional[bool] = False

class AssistantRequest(BaseModel):
    query: str = Field(..., description="User question or incident summary")

@app.get("/")
def root():
    return {
        "service": "CyberRakshak AI Microservice",
        "status": "active",
        "version": "1.0.0",
        "supportedCategories": [
            "UPI_SCAM", "PHISHING", "FAKE_JOB", "FAKE_SHOPPING",
            "ACCOUNT_TAKEOVER", "SOCIAL_MEDIA_FRAUD", "OTP_FRAUD",
            "INVESTMENT_SCAM", "IDENTITY_THEFT", "MALWARE", "OTHER"
        ]
    }

@app.get("/health")
def health():
    return {"status": "UP", "service": "cyberrakshak-ai"}

@app.get("/model-info")
def model_info():
    return {
        "modelType": "TF-IDF + Multinomial Naive Bayes with Heuristic Fraud Feature Extractor",
        "features": ["Character and word n-grams", "Financial loss heuristics", "OTP/Credential patterns"],
        "version": "1.0-prod",
        "status": "ready"
    }

@app.post("/predict-scam")
def predict_scam(request: TextClassificationRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    return classifier_instance.predict(request.text)

@app.post("/analyze-url")
def analyze_suspicious_url(request: UrlAnalysisRequest):
    if not request.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty")
    return analyze_url(request.url)

@app.post("/risk-indicators")
def risk_indicators(request: RiskScoreRequest):
    return calculate_incident_risk(
        category=request.category,
        description=request.description,
        financial_loss=request.financialLoss or 0.0,
        has_otp=request.hasOtp or False,
        has_url=request.hasUrl or False,
        has_apk=request.hasApk or False
    )

@app.post("/assistant-chat")
def assistant_chat(request: AssistantRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    return get_assistant_response(request.query)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
