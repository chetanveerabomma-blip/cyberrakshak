// Standalone Client-Side Fallback Engine for GitHub Pages & Offline Demos

const SEEDED_CASES = [
  {
    id: "case-001",
    caseNumber: "CR-2026-0812",
    incidentId: "inc-001",
    userId: "user-cit-01",
    reporterName: "Rahul Sharma",
    title: "Fake Electricity Bill Disconnection SMS",
    category: "SMS_PHISHING",
    priority: "HIGH",
    status: "INVESTIGATING",
    assignedOfficerName: "Insp. Vikram Rathore",
    assignedOfficerEmail: "vikram.rathore@cyberrakshak.in",
    fraudAmount: 18500,
    evidenceCount: 3,
    createdAt: "2026-09-18T10:30:00Z",
    timeline: [
      { status: "REPORTED", title: "Incident Lodged", description: "Incident reported by citizen via CyberRakshak portal", timestamp: "2026-09-18T10:30:00Z" },
      { status: "UNDER_REVIEW", title: "Assigned for Review", description: "Case assigned to Inspector Vikram Rathore", timestamp: "2026-09-18T11:15:00Z" },
      { status: "INVESTIGATING", title: "Evidence Verified", description: "Payment screenshot SHA-256 hashes verified with ICICI Bank", timestamp: "2026-09-19T09:00:00Z" }
    ]
  },
  {
    id: "case-002",
    caseNumber: "CR-2026-0813",
    incidentId: "inc-002",
    userId: "user-cit-01",
    reporterName: "Priya Patel",
    title: "Remote Part-Time YouTube Video Liking Scam",
    category: "FAKE_JOB",
    priority: "CRITICAL",
    status: "UNDER_REVIEW",
    assignedOfficerName: "Insp. Vikram Rathore",
    assignedOfficerEmail: "vikram.rathore@cyberrakshak.in",
    fraudAmount: 75000,
    evidenceCount: 4,
    createdAt: "2026-09-19T14:20:00Z",
    timeline: [
      { status: "REPORTED", title: "Incident Lodged", description: "Reported Telegram investment task fraud", timestamp: "2026-09-19T14:20:00Z" },
      { status: "UNDER_REVIEW", title: "Under Review", description: "Initial risk assessed at 88/100 (CRITICAL)", timestamp: "2026-09-19T14:35:00Z" }
    ]
  },
  {
    id: "case-003",
    caseNumber: "CR-2026-0814",
    incidentId: "inc-003",
    userId: "user-cit-02",
    reporterName: "Amit Verma",
    title: "OLX Army Officer QR Code Advance Scam",
    category: "UPI_SCAM",
    priority: "MEDIUM",
    status: "ACTION_TAKEN",
    assignedOfficerName: "Insp. Vikram Rathore",
    assignedOfficerEmail: "vikram.rathore@cyberrakshak.in",
    fraudAmount: 12000,
    evidenceCount: 2,
    createdAt: "2026-09-20T08:15:00Z",
    timeline: [
      { status: "REPORTED", title: "Incident Lodged", description: "QR code scam reported", timestamp: "2026-09-20T08:15:00Z" },
      { status: "ACTION_TAKEN", title: "Beneficiary Account Freezing Request", description: "Lien marked on fraudulent beneficiary UPI ID via 1930 portal", timestamp: "2026-09-20T12:00:00Z" }
    ]
  }
];

const SEEDED_AWARENESS = [
  {
    id: "art-1",
    slug: "upi-qr-code-frauds",
    title: "The UPI QR Code Trap: Why You Never Enter a PIN to Receive Money",
    category: "UPI & Banking",
    readTime: "4 min read",
    summary: "Scammers pretend to buy items on OLX/Facebook and send a QR code claiming 'Scan to receive money'. Remember: Scanning a QR code and entering your UPI PIN always DEBITS your account.",
    content: "Golden Rule: You NEVER need to enter your UPI PIN, OTP, or scan a QR code to RECEIVE money into your bank account. Scammers use fake military IDs or urgent business pretexts.",
    preventionSteps: [
      "Never scan a QR code sent by a buyer or stranger.",
      "Never share your 4-digit or 6-digit UPI PIN with anyone.",
      "If money was deducted, immediately call 1930 within 2 hours for Golden Hour account freezing."
    ]
  },
  {
    id: "art-2",
    slug: "part-time-telegram-job-scams",
    title: "Work From Home 'Telegram Like & Earn' Scams Explained",
    category: "Employment Frauds",
    readTime: "5 min read",
    summary: "Victims are added to Telegram groups and paid ₹150 for liking videos, then lured into depositing lakhs for 'crypto prepaid tasks'.",
    content: "This is currently India's fastest-growing cyber scam. Victims are asked to review hotels or like YouTube videos. After building trust with small payouts of ₹200-₹500, victims are tricked into VIP investment tiers.",
    preventionSteps: [
      "Legitimate companies never hire via random WhatsApp or Telegram messages.",
      "Never pay upfront money or deposits for job tasks.",
      "Report fraudulent Telegram channels to cybercrime authorities immediately."
    ]
  },
  {
    id: "art-3",
    slug: "digital-arrest-cbi-scam",
    title: "What is 'Digital Arrest' and How Fake Police Video Calls Work",
    category: "Impersonation",
    readTime: "6 min read",
    summary: "Scammers impersonating CBI/ED officers place Skype or WhatsApp video calls in fake police setups, claiming illegal packages have been found in your name.",
    content: "IMPORTANT: Indian Law Enforcement, CBI, ED, and Mumbai Police DO NOT conduct court hearings or arrest citizens via Skype or WhatsApp video calls. 'Digital Arrest' does not exist in Indian legal statutes.",
    preventionSteps: [
      "Disconnect WhatsApp or Skype video calls from unknown numbers immediately.",
      "Indian Police never demand verification payments or security deposits.",
      "Immediately report the caller number on the Chakshu portal (sancharsaathi.gov.in)."
    ]
  }
];

export function handleMockFallback(endpoint, options = {}) {
  const method = options.method || 'GET';
  let body = {};
  if (options.body && typeof options.body === 'string') {
    try { body = JSON.parse(options.body); } catch {}
  }

  // Auth
  if (endpoint === '/auth/login') {
    const email = body.email || 'citizen1@demo.com';
    let role = 'ROLE_CITIZEN';
    let name = 'Demo Citizen';
    if (email.includes('admin')) {
      role = 'ROLE_ADMIN';
      name = 'Cyber Security Director';
    } else if (email.includes('officer') || email.includes('rathore')) {
      role = 'ROLE_OFFICER';
      name = 'Insp. Vikram Rathore';
    }
    return Promise.resolve({
      token: 'demo-jwt-token-cyberrakshak',
      id: 'demo-user-id',
      email,
      name,
      role
    });
  }

  if (endpoint === '/auth/register') {
    return Promise.resolve({
      token: 'demo-jwt-token-cyberrakshak',
      id: 'registered-user-id',
      email: body.email || 'newuser@example.com',
      name: body.name || 'New User',
      role: 'ROLE_CITIZEN'
    });
  }

  if (endpoint === '/auth/me') {
    const userStr = localStorage.getItem('cyberrakshak_user');
    const u = userStr ? JSON.parse(userStr) : {
      id: 'demo-user-id',
      email: 'citizen1@demo.com',
      name: 'Demo Citizen',
      role: 'ROLE_CITIZEN'
    };
    return Promise.resolve(u);
  }

  // Live Classify
  if (endpoint === '/incidents/classify') {
    const text = (body.text || '').toLowerCase();
    let category = 'GENERAL_CYBER_FRAUD';
    let risk = 50;
    let confidence = 0.88;
    let factors = ['Incident reported online'];

    if (text.includes('upi') || text.includes('qr') || text.includes('gpay') || text.includes('phonepe') || text.includes('pin')) {
      category = 'UPI_SCAM';
      risk = 82;
      confidence = 0.94;
      factors = ['UPI / payment keyword matched', 'Potential credential / PIN compromise detected'];
    } else if (text.includes('link') || text.includes('click') || text.includes('sms') || text.includes('bill') || text.includes('bank')) {
      category = 'PHISHING';
      risk = 76;
      confidence = 0.91;
      factors = ['Phishing pattern identified', 'Unauthorized link sharing suspected'];
    } else if (text.includes('job') || text.includes('telegram') || text.includes('like') || text.includes('task') || text.includes('part-time')) {
      category = 'FAKE_JOB';
      risk = 89;
      confidence = 0.95;
      factors = ['High-yield task pattern', 'Telegram group advance payment fraud'];
    } else if (text.includes('cbi') || text.includes('police') || text.includes('arrest') || text.includes('video call')) {
      category = 'IMPERSONATION_EXTORTION';
      risk = 95;
      confidence = 0.98;
      factors = ['Digital arrest scam indicators', 'High psychological coercion tactics'];
    }

    return Promise.resolve({
      category,
      confidence,
      riskScore: risk,
      riskLevel: risk > 75 ? 'CRITICAL' : risk > 50 ? 'HIGH' : 'MEDIUM',
      urgency: 'HIGH',
      riskFactors: factors,
      recommendedActions: [
        "Do not transfer any further money or scan QR codes.",
        "Call 1930 Cyber Fraud Helpline immediately.",
        "Download structured CyberRakshak legal complaint draft."
      ]
    });
  }

  // Report Incident
  if (endpoint === '/incidents' && method === 'POST') {
    const newInc = {
      id: 'inc-' + Date.now(),
      caseNumber: 'CR-2026-' + Math.floor(1000 + Math.random() * 9000),
      title: body.title || 'Reported Incident',
      category: body.category || 'UPI_SCAM',
      incidentDate: body.incidentDate || new Date().toISOString(),
      fraudAmount: body.fraudAmount || 0,
      riskScore: 78,
      riskLevel: 'HIGH',
      status: 'REPORTED',
      createdAt: new Date().toISOString()
    };
    return Promise.resolve(newInc);
  }

  // Cases
  if (endpoint === '/cases') {
    return Promise.resolve(SEEDED_CASES);
  }

  if (endpoint.startsWith('/cases/track/') || endpoint.startsWith('/cases/')) {
    const caseId = endpoint.split('/')[2];
    const found = SEEDED_CASES.find(c => c.caseNumber === caseId || c.id === caseId) || SEEDED_CASES[0];
    return Promise.resolve(found);
  }

  // URL Scanner
  if (endpoint === '/url/analyze') {
    const rawUrl = (body.url || '').toLowerCase();
    let isPhishing = false;
    let score = 25;
    let reasons = ['HTTPS protocol active'];

    if (rawUrl.includes('sbi') || rawUrl.includes('hdfc') || rawUrl.includes('icici') || rawUrl.includes('paytm')) {
      if (!rawUrl.includes('.bank.in') && !rawUrl.includes('.co.in') && !rawUrl.includes('.com/')) {
        isPhishing = true;
        score = 88;
        reasons.push('Banking brand name detected in unauthorized third-party domain');
      }
    }
    if (rawUrl.includes('.xyz') || rawUrl.includes('.top') || rawUrl.includes('.buzz') || rawUrl.includes('.tk')) {
      score += 35;
      reasons.push('High-risk suspicious Top-Level Domain (TLD)');
    }
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(rawUrl)) {
      score += 40;
      reasons.push('Direct raw IP address hostname detected');
    }
    if (rawUrl.startsWith('http://')) {
      score += 20;
      reasons.push('Insecure unencrypted HTTP connection');
    }
    score = Math.min(score, 99);

    const result = {
      id: 'scan-' + Date.now(),
      url: body.url,
      domain: body.url.replace(/^https?:\/\//, '').split('/')[0],
      riskScore: score,
      riskLevel: score > 70 ? 'CRITICAL' : score > 45 ? 'SUSPICIOUS' : 'SAFE',
      isPhishing: score > 60,
      ipAddress: '104.21.45.182',
      country: 'Unknown/Proxy',
      reasons: reasons,
      safetyRecommendations: [
        'Do not submit login credentials or OTPs on this website.',
        'Always check official portal addresses directly from your bank passbook.',
        'Report suspicious links to the National Cyber Crime Portal.'
      ],
      createdAt: new Date().toISOString()
    };
    return Promise.resolve(result);
  }

  if (endpoint === '/url/history' || endpoint === '/url/recent') {
    return Promise.resolve([
      { id: 'scan-1', url: 'http://sbi-kyc-verify-portal.top/login', domain: 'sbi-kyc-verify-portal.top', riskScore: 92, riskLevel: 'CRITICAL', isPhishing: true, createdAt: '2026-09-20T11:00:00Z' },
      { id: 'scan-2', url: 'https://netflix-subscription-update.xyz', domain: 'netflix-subscription-update.xyz', riskScore: 84, riskLevel: 'CRITICAL', isPhishing: true, createdAt: '2026-09-19T16:30:00Z' },
      { id: 'scan-3', url: 'https://onlinesbi.sbi', domain: 'onlinesbi.sbi', riskScore: 5, riskLevel: 'SAFE', isPhishing: false, createdAt: '2026-09-19T09:15:00Z' }
    ]);
  }

  // Awareness
  if (endpoint === '/awareness') {
    return Promise.resolve(SEEDED_AWARENESS);
  }

  // Analytics (Admin)
  if (endpoint === '/admin/analytics') {
    return Promise.resolve({
      totalIncidents: 42,
      activeCases: 17,
      resolvedCases: 25,
      highRiskCount: 19,
      totalLossReported: 485000,
      totalLossRecovered: 162000,
      categoryDistribution: {
        UPI_SCAM: 16,
        PHISHING: 11,
        FAKE_JOB: 8,
        IMPERSONATION: 4,
        IDENTITY_THEFT: 3
      },
      stateDistribution: {
        Maharashtra: 12,
        Delhi: 9,
        Karnataka: 8,
        Telangana: 6,
        UttarPradesh: 7
      }
    });
  }

  // Scam Patterns
  if (endpoint === '/admin/scam-patterns') {
    return Promise.resolve([
      { pattern: 'Fake Electricity Disconnection SMS with APK downloads', frequency: 14, threatLevel: 'HIGH', affectedRegion: 'North & West India' },
      { pattern: 'Telegram Like & Earn VIP investment traps', frequency: 19, threatLevel: 'CRITICAL', affectedRegion: 'Pan India' },
      { pattern: 'Fake Customs Courier parcel impersonating Mumbai Police', frequency: 7, threatLevel: 'CRITICAL', affectedRegion: 'Metros' }
    ]);
  }

  // AI Chat
  if (endpoint === '/ai/chat') {
    const q = (body.query || '').toLowerCase();
    let reply = "Hello! I am your CyberRakshak AI Assistant. If you have been scammed or lost money, please immediately dial 1930 to trigger the Golden Hour inter-bank fund freeze, and file an incident in the Report tab.";
    if (q.includes('money') || q.includes('lost') || q.includes('upi') || q.includes('freeze')) {
      reply = "🚨 IMMEDIATE ACTION REQUIRED:\n1. Call 1930 (National Cybercrime Helpline) immediately with your Transaction Reference ID (UTR / RRN).\n2. Contact your bank's 24x7 toll-free fraud helpline to freeze your debit card/netbanking.\n3. Take full screenshots of the transaction message, UPI ID, and recipient details.\n4. Click 'Report Incident' in CyberRakshak to generate a pre-formatted legal complaint draft.";
    } else if (q.includes('cbi') || q.includes('police') || q.includes('arrest')) {
      reply = "⚠️ CAUTION: 'Digital Arrest' is a completely fraudulent scam! The CBI, ED, and Indian Police never arrest citizens or demand security deposits over Skype or WhatsApp calls. Disconnect immediately and block the number.";
    }
    return Promise.resolve({ response: reply, actions: ["Call 1930 Helpline", "Report on CyberRakshak", "Lock Bank App"] });
  }

  // Fallback generic response
  return Promise.resolve({ success: true, message: 'Processed via client preview engine' });
}
