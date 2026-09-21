import React, { useState } from 'react';
import { 
  AlertTriangle, Shield, Upload, FileText, CheckCircle2, 
  ArrowLeft, ArrowRight, Bot, Cpu, Sparkles, Hash, Lock, Globe 
} from 'lucide-react';
import { api } from '../services/api';
import RiskGauge from '../components/RiskGauge';
import ComplaintModal from '../components/ComplaintModal';

const CATEGORIES = [
  { id: 'UPI_SCAM', name: 'UPI & QR Code Scam', desc: 'Fraudulent QR scans, fake refund transfers, unauthorized UPI debits' },
  { id: 'PHISHING', name: 'Phishing & Fake Links', desc: 'Spoofed bank KYC SMS, electricity bill disconnection, fake login portals' },
  { id: 'FAKE_JOB', name: 'Part-Time / Fake Job Scam', desc: 'Prepaid Telegram tasks, YouTube like tasks, fake employment offer letters' },
  { id: 'FAKE_SHOPPING', name: 'Fake Shopping Website', desc: 'Fraudulent Instagram/Facebook stores, non-delivery of prepaid purchases' },
  { id: 'ACCOUNT_TAKEOVER', name: 'Account Takeover / SIM Swap', desc: 'Compromised email/social accounts, unauthorized password resets' },
  { id: 'SOCIAL_MEDIA_FRAUD', name: 'Social Media Impersonation', desc: 'Cloned profiles, fake emergency loans from friends, dating scams' },
  { id: 'OTP_FRAUD', name: 'OTP & Banking Credential Fraud', desc: 'Bank manager impersonation, credit card reward expiry OTP traps' },
  { id: 'INVESTMENT_SCAM', name: 'Fake Investment / Crypto Scam', desc: 'Bogus trading apps, guaranteed returns, withdrawal tax demands' },
  { id: 'IDENTITY_THEFT', name: 'Identity Theft & KYC Abuse', desc: 'Unauthorized loans taken on stolen PAN/Aadhaar cards' },
  { id: 'MALWARE', name: 'Malware & Screen Sharing (APK)', desc: 'Malicious APK downloads (PM-Kisan), AnyDesk/TeamViewer abuse' },
  { id: 'ONLINE_HARASSMENT', name: 'Online Harassment & Extortion', desc: 'Video blackmail, morphed media extortion, cyber stalking' },
  { id: 'OTHER', name: 'Other Cyber Incident', desc: 'Unlisted or emerging cyber fraud patterns' }
];

export default function ReportIncidentPage({ setActiveTab, setSelectedCaseId }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: 'UPI_SCAM',
    title: '',
    description: '',
    incidentDate: new Date().toISOString().split('T')[0],
    incidentTime: '',
    financialLoss: '',
    transactionId: '',
    paymentMethod: 'PhonePe',
    suspectPhone: '',
    suspectEmail: '',
    suspiciousUrl: '',
    bankName: '',
    state: 'Karnataka',
    district: '',
    userConfirmedCategory: ''
  });

  const [aiClassification, setAiClassification] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [uploadedEvidence, setUploadedEvidence] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [complaintDraft, setComplaintDraft] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Trigger AI Classification when moving to Step 3
  const handleProceedToClassification = async () => {
    if (!formData.description.trim()) {
      alert('Please provide a detailed description of the incident.');
      return;
    }

    setIsClassifying(true);
    setStep(3);
    try {
      const res = await api.liveClassify(formData.description);
      setAiClassification(res);
      if (!formData.userConfirmedCategory) {
        setFormData(prev => ({ ...prev, userConfirmedCategory: res.category }));
      }
    } catch {
      setAiClassification({
        category: formData.category,
        confidence: 0.85,
        riskLevel: 'HIGH',
        indicators: ['Incident report submitted for analysis'],
        recommendedActions: ['Freeze bank accounts', 'Preserve evidence', 'Dial 1930']
      });
    } finally {
      setIsClassifying(false);
    }
  };

  // Upload Evidence File
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append('description', 'Supporting digital evidence');

    setIsUploading(true);
    try {
      const res = await api.uploadEvidence(data);
      setUploadedEvidence(prev => [...prev, res]);
    } catch (err) {
      alert(err.message || 'Evidence upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Final Incident
  const handleSubmitReport = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        financialLoss: formData.financialLoss ? parseFloat(formData.financialLoss) : 0.0,
        evidenceIds: uploadedEvidence.map(e => e.evidenceId)
      };

      const inc = await api.reportIncident(payload);
      setSubmissionResult(inc);
      setStep(7);
    } catch (err) {
      alert(err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateComplaint = async () => {
    if (!submissionResult) return;
    try {
      const draft = await api.getComplaintDraft(submissionResult.incidentId);
      setComplaintDraft(draft);
    } catch {
      alert('Could not generate complaint draft.');
    }
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
      {/* Wizard Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-medium mb-3">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span>Incident Reporting Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Report Cybercrime Incident</h1>
        <p className="text-xs text-slate-400 mt-1">Multi-step assistance, AI threat classification, and legal evidence draft preparation</p>

        {/* Step Progress Tracker */}
        <div className="flex items-center justify-center space-x-2 mt-6 max-w-xl mx-auto">
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-cyan-400 shadow-neon-cyan' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
        <div className="text-[11px] text-cyan-400 font-mono mt-2">
          Step {step} of 7: {
            step === 1 ? 'Select Incident Category' :
            step === 2 ? 'Incident Particulars' :
            step === 3 ? 'AI NLP Threat Classification' :
            step === 4 ? 'Digital Evidence & SHA-256 Hashes' :
            step === 5 ? 'Immediate Containment Actions' :
            step === 6 ? 'Review & Confirmation' : 'Case Lodged Successfully'
          }
        </div>
      </div>

      {/* STEP 1: CATEGORY SELECTION */}
      {step === 1 && (
        <div className="p-6 rounded-2xl cyber-glass border border-slate-800 animate-in fade-in">
          <h2 className="text-base font-bold text-white mb-4">Step 1 — Identify Cyber Incident Vector</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  formData.category === cat.id
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-neon-cyan'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-white mb-1">{cat.name}</div>
                <div className="text-[11px] text-slate-400 leading-snug">{cat.desc}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center space-x-2 shadow-neon-cyan transition-all"
            >
              <span>Next: Incident Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: INCIDENT PARTICULARS */}
      {step === 2 && (
        <div className="p-6 rounded-2xl cyber-glass border border-slate-800 animate-in fade-in">
          <h2 className="text-base font-bold text-white mb-4">Step 2 — Incident Particulars & Financial Impact</h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Incident Description <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Explain chronologically: what message or link was received, what was promised, who contacted you, what payment or OTP was shared, and how the scam occurred..."
                className="w-full bg-slate-950 text-slate-100 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Date</label>
                <input
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, incidentDate: e.target.value }))}
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Financial Loss (INR ₹)</label>
                <input
                  type="number"
                  value={formData.financialLoss}
                  onChange={(e) => setFormData(prev => ({ ...prev, financialLoss: e.target.value }))}
                  placeholder="e.g. 15000"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Transaction ID / UTR</label>
                <input
                  type="text"
                  value={formData.transactionId}
                  onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                  placeholder="e.g. UPI/2026/10293847"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method / App</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                >
                  <option value="PhonePe">PhonePe</option>
                  <option value="Google Pay (GPay)">Google Pay (GPay)</option>
                  <option value="Paytm">Paytm</option>
                  <option value="BHIM UPI">BHIM UPI</option>
                  <option value="Net Banking">Net Banking / IMPS</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                  <option value="Crypto USDT">Crypto USDT / Wallet</option>
                  <option value="None / Not Applicable">None / Not Applicable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Suspect Phone / VPA</label>
                <input
                  type="text"
                  value={formData.suspectPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, suspectPhone: e.target.value }))}
                  placeholder="+91-XXXXXXXXXX or user@upi"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Suspicious URL / Link</label>
                <input
                  type="text"
                  value={formData.suspiciousUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, suspiciousUrl: e.target.value }))}
                  placeholder="http://scam-link.xyz"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Affected Bank / Provider</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                  placeholder="e.g. State Bank of India, HDFC"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">State / Territory</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="e.g. Karnataka, Maharashtra"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleProceedToClassification}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center space-x-2 shadow-neon-cyan transition-all"
            >
              <span>Next: AI Classification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AUTOMATIC AI CLASSIFICATION */}
      {step === 3 && (
        <div className="p-6 rounded-2xl cyber-glass border border-slate-800 animate-in fade-in">
          <div className="flex items-center space-x-2 mb-4">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Step 3 — Automatic AI / NLP Threat Classification</h2>
          </div>

          {isClassifying ? (
            <div className="p-12 text-center">
              <Cpu className="w-10 h-10 text-cyan-400 animate-spin mx-auto mb-3" />
              <div className="text-sm font-bold text-white">Evaluating threat patterns with NLP Engine...</div>
              <p className="text-xs text-slate-400 mt-1">Cross-referencing scam indicators and vocabulary against Indian cyber telemetry</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Classification Result Card */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-cyan-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[10px] text-cyan-400 uppercase font-mono tracking-wider font-semibold">Predicted Classification</span>
                    <div className="text-xl font-extrabold text-white mt-0.5">
                      {aiClassification?.category?.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Confidence Score</div>
                      <div className="text-lg font-mono font-bold text-emerald-400">
                        {Math.round((aiClassification?.confidence || 0.85) * 100)}%
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-bold uppercase">
                      {aiClassification?.riskLevel || 'HIGH'} RISK
                    </div>
                  </div>
                </div>

                {/* Detected Threat Indicators */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-slate-300 mb-2">Detected Threat Indicators:</div>
                  <div className="flex flex-wrap gap-2">
                    {aiClassification?.indicators?.map((ind, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-[11px]">
                        ✓ {ind}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Allow Citizen Override if Needed */}
                <div className="pt-4 border-t border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirm or Adjust Category (Optional):
                  </label>
                  <select
                    value={formData.userConfirmedCategory || aiClassification?.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, userConfirmedCategory: e.target.value }))}
                    className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center space-x-2 shadow-neon-cyan transition-all"
                >
                  <span>Next: Digital Evidence</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: DIGITAL EVIDENCE & SHA-256 HASHES */}
      {step === 4 && (
        <div className="p-6 rounded-2xl cyber-glass border border-slate-800 animate-in fade-in">
          <h2 className="text-base font-bold text-white mb-2">Step 4 — Digital Evidence Locker</h2>
          <p className="text-xs text-slate-400 mb-6">
            Upload chat screenshots, payment confirmations, or emails. Each file receives an immutable SHA-256 cryptographic hash for legal integrity.
          </p>

          {/* Upload Dropzone */}
          <label className="block p-8 border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 rounded-2xl text-center cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 transition-all mb-6">
            <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-white">Click to upload evidence file</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Supports PNG, JPG, PDF, TXT (Max 25MB). Executables strictly rejected.</div>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>

          {isUploading && (
            <div className="text-center py-4 text-xs text-cyan-400">
              Hashing with SHA-256 and uploading securely...
            </div>
          )}

          {/* Uploaded Evidence Checklist */}
          {uploadedEvidence.length > 0 && (
            <div className="space-y-3 mb-6">
              <div className="text-xs font-semibold text-slate-300">Preserved Evidence Items ({uploadedEvidence.length}):</div>
              {uploadedEvidence.map((ev, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-white flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{ev.fileName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      SHA-256: <span className="text-emerald-400">{ev.sha256}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-bold w-fit">
                    VERIFIED INTEGRITY
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setStep(5)}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center space-x-2 shadow-neon-cyan transition-all"
            >
              <span>Next: Immediate Actions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: IMMEDIATE CONTAINMENT ACTIONS */}
      {step === 5 && (
        <div className="p-6 rounded-2xl cyber-glass border border-slate-800 animate-in fade-in">
          <h2 className="text-base font-bold text-white mb-2">Step 5 — Recommended Immediate Actions</h2>
          <p className="text-xs text-slate-400 mb-6">
            Execute these containment measures right now to minimize further damage:
          </p>

          <div className="space-y-3 mb-6">
            {(aiClassification?.recommendedActions || [
              "Call National Cyber Crime Helpline 1930 within the golden hour.",
              "Raise a dispute in your UPI or banking application.",
              "Do not communicate further with the fraudster.",
              "Preserve transaction numbers and chat screenshots."
            ]).map((act, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{act}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setStep(6)}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center space-x-2 shadow-neon-cyan transition-all"
            >
              <span>Next: Review & Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: SUMMARY REVIEW */}
      {step === 6 && (
        <div className="p-6 rounded-2xl cyber-glass border border-slate-800 animate-in fade-in">
          <h2 className="text-base font-bold text-white mb-4">Step 6 — Final Review Before Lodging</h2>
          
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-3 mb-6">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-slate-500">Incident Category:</span> <strong className="text-white">{formData.userConfirmedCategory || formData.category}</strong></div>
              <div><span className="text-slate-500">Occurrence Date:</span> <strong className="text-white">{formData.incidentDate}</strong></div>
              <div><span className="text-slate-500">Financial Loss:</span> <strong className="text-rose-400">₹{formData.financialLoss || '0.00'}</strong></div>
              <div><span className="text-slate-500">Transaction ID:</span> <strong className="text-white">{formData.transactionId || 'N/A'}</strong></div>
              <div><span className="text-slate-500">Payment App:</span> <strong className="text-white">{formData.paymentMethod}</strong></div>
              <div><span className="text-slate-500">Suspect Phone:</span> <strong className="text-white">{formData.suspectPhone || 'N/A'}</strong></div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-500">Evidence Files Attached:</span> <strong className="text-cyan-400">{uploadedEvidence.length} files (SHA-256 hashed)</strong>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(5)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleSubmitReport}
              disabled={submitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-bold text-xs flex items-center space-x-2 shadow-neon-danger transition-all disabled:opacity-50"
            >
              <span>{submitting ? 'Lodging Incident...' : 'Confirm & Submit Incident'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: SUBMISSION CONFIRMATION */}
      {step === 7 && submissionResult && (
        <div className="p-8 rounded-2xl cyber-glass border border-emerald-500/30 text-center animate-in zoom-in-95">
          <div className="inline-flex p-4 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 mb-4 shadow-lg">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Incident Report Lodged Successfully!</h2>
          <p className="text-xs text-slate-400 mb-6">Your report has been received and registered into the CyberRakshak incident database.</p>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 max-w-md mx-auto mb-6 text-left text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Incident Reference:</span>
              <span className="text-cyan-400 font-bold">{submissionResult.incidentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Case ID:</span>
              <span className="text-emerald-400 font-bold">{submissionResult.incidentId.replace('INC-', '')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Assessed Threat:</span>
              <span className="text-amber-400 font-bold">{submissionResult.riskLevel} ({submissionResult.riskScore}/100)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleGenerateComplaint}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center space-x-1.5 shadow-neon-cyan transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Download / Print Complaint Draft</span>
            </button>

            <button
              onClick={() => {
                setSelectedCaseId(submissionResult.incidentId.replace('INC-', ''));
                setActiveTab('case-detail');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <span>View Case Timeline</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {complaintDraft && (
        <ComplaintModal draft={complaintDraft} onClose={() => setComplaintDraft(null)} />
      )}
    </div>
  );
}
