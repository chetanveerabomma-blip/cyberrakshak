# 🛡️ CyberRakshak — Student & Citizen Cybercrime Assistant

> **"Detect. Report. Respond. Stay Safe."**  
> A production-style, AI-driven cybersecurity assistance and incident-response platform designed for students and citizens across India.

---

## 🌟 Key Features

- **🚨 Incident Reporting Wizard**: 7-step guided incident reporting with immediate safety checklists and evidence upload.
- **🤖 AI / NLP Scam Classification**: Real-time classification of scams (UPI fraud, Phishing, Job fraud, Sextortion, Investment scams) using Scikit-Learn NLP models.
- **🔍 Heuristic Suspicious URL Scanner**: Detects brand spoofing, suspicious TLDs, IP hostnames, punycode tricks, and generates risk breakdown scores (0–100).
- **📋 Structured Cybercrime Complaint Generator**: Automatically generates ready-to-file legal complaint drafts compliant with National Cyber Crime Reporting Portal formats (1930 / cybercrime.gov.in).
- **🔒 Case Lifecycle & Evidence Integrity**: Track cases across stages (`REPORTED`, `UNDER_REVIEW`, `INVESTIGATING`, `ACTION_TAKEN`, `CLOSED`) with SHA-256 evidence hashing.
- **📊 Admin & Officer Threat Intelligence**: Interactive analytics, scam pattern clustering, category distributions, and state-wise incident heatmaps.
- **💬 AI Security Advisor**: Real-time floating emergency assistant with actionable advice and instant 1930 helpline guidance.
- **📚 Awareness Hub & Safety Quiz**: Guides on modern cyber threats and an interactive cyber safety quiz with immediate explanations.

---

## 🏗️ Architecture & Technology Stack

CyberRakshak is built using a modern microservice-inspired architecture:

```
                  ┌─────────────────────────────────┐
                  │      React 18 + Vite Frontend   │
                  │   Tailwind CSS + Lucide Icons   │
                  └────────────────┬────────────────┘
                                   │
                                   ▼ /api (Proxy)
                  ┌─────────────────────────────────┐
                  │   Spring Boot 3.3.4 Backend     │
                  │ Spring Security + JWT + MongoDB │
                  └────────┬───────────────┬────────┘
                           │               │
      Internal AI Requests │               │ Data Persistence
                           ▼               ▼
        ┌──────────────────────┐      ┌────────────────┐
        │ Python 3.12 FastAPI  │      │ MongoDB 8.x    │
        │ Scikit-Learn NLP     │      │ cyberrakshak_db│
        │ Heuristic Risk Engine│      └────────────────┘
        └──────────────────────┘
```

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Java 21+ / 26, Spring Boot 3.3.4, Spring Security, Spring Data MongoDB, JJWT.
- **AI Microservice**: Python FastAPI, Scikit-Learn (TF-IDF + Multinomial Naive Bayes), Heuristic Risk Engine.
- **Database**: MongoDB (fully pre-seeded with incidents, cases, audit logs, and awareness guides).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Java JDK (v21+) & Maven
- Python (v3.10+)
- MongoDB running on `mongodb://localhost:27017`

---

### 1. Start Python AI Microservice
```bash
cd ai-service
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation available at: `http://localhost:8000/docs`

---

### 2. Start Spring Boot Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/cyberrakshak-backend-1.0.0.jar
```
Backend runs at: `http://localhost:8080/api`

---

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```
Open application at: `http://localhost:5173`

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Admin** | `admin@cyberrakshak.in` | `Password123!` | System dashboard, fraud patterns, user & audit logs |
| **Cyber Officer** | `vikram.rathore@cyberrakshak.in` | `Password123!` | Case lifecycle management, timeline updates, assignments |
| **Citizen / Student** | `citizen1@demo.com` | `Password123!` | Report incidents, URL scanner, complaint draft generator |

*(One-click demo login buttons are provided directly on the Login page)*

---

## 🇮🇳 Emergency Indian Cyber Helplines
- **National Cybercrime Reporting Helpline**: Dial `1930`
- **National Cybercrime Portal**: [cybercrime.gov.in](https://cybercrime.gov.in)
- **Emergency Number**: `112`

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
