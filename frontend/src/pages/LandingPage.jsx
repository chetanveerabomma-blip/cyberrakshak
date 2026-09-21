import React, { useState } from 'react';
import { Shield, AlertTriangle, Globe, Search, ArrowRight, CheckCircle2, Lock, Cpu, Database, Eye, Terminal, Sparkles, FileText, PhoneCall } from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  const [quickUrl, setQuickUrl] = useState('');

  const handleQuickScan = (e) => {
    e.preventDefault();
    if (quickUrl.trim()) {
      sessionStorage.setItem('pending_scan_url', quickUrl.trim());
      setActiveTab('url-scanner');
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-4 pt-16 pb-20 text-center">
        
        {/* Subtle Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>India's Dedicated Cyber Incident & Scam Response Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight mb-6">
          Detect. Report. Respond.{' '}
          <span className="cyber-gradient-text">Stay Safe.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          CyberRakshak is an advanced incident-response and cybersecurity assistance platform designed for students and citizens. Classify online fraud, analyze suspicious URLs, generate structured legal evidence drafts, and take immediate action.
        </p>

        {/* Quick URL Scanner Bar */}
        <form onSubmit={handleQuickScan} className="max-w-2xl mx-auto mb-10">
          <div className="relative flex items-center p-1.5 rounded-2xl bg-[#0B1324] border border-cyan-500/30 shadow-2xl focus-within:border-cyan-400 focus-within:shadow-neon-cyan transition-all">
            <Globe className="w-5 h-5 text-cyan-400 ml-3 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="Paste suspicious website or SMS link (e.g., http://sbi-kyc-update.top)..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none px-2 py-2"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs flex items-center space-x-1.5 shadow-neon-cyan transition-all flex-shrink-0"
            >
              <span>Scan URL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActiveTab('report')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm flex items-center space-x-2 shadow-neon-danger transition-all"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Cyber Incident</span>
          </button>

          <button
            onClick={() => setActiveTab('awareness')}
            className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center space-x-2 transition-all"
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Learn Cyber Safety</span>
          </button>

          <button
            onClick={() => setActiveTab('track-case')}
            className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center space-x-2 transition-all"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Track Existing Case</span>
          </button>
        </div>

        {/* Live System Telemetry Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl cyber-glass border border-slate-800">
            <div className="text-2xl font-bold font-mono text-cyan-400">10+</div>
            <div className="text-xs text-slate-400 mt-1">Scam Vectors Handled</div>
          </div>
          <div className="p-4 rounded-xl cyber-glass border border-slate-800">
            <div className="text-2xl font-bold font-mono text-emerald-400">SHA-256</div>
            <div className="text-xs text-slate-400 mt-1">Tamper-Proof Evidence</div>
          </div>
          <div className="p-4 rounded-xl cyber-glass border border-slate-800">
            <div className="text-2xl font-bold font-mono text-sky-400">AI / NLP</div>
            <div className="text-xs text-slate-400 mt-1">Threat Classification</div>
          </div>
          <div className="p-4 rounded-xl cyber-glass border border-slate-800">
            <div className="text-2xl font-bold font-mono text-amber-400">1930</div>
            <div className="text-xs text-slate-400 mt-1">National Helpline Link</div>
          </div>
        </div>
      </section>

      {/* Feature Modules Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 border-t border-slate-800/80">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Enterprise Cyber Incident Management</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">Equipped with specialized tools for students, general citizens, and cyber security officers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl cyber-glass border border-slate-800 hover:border-cyan-500/30 transition-all group">
            <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 w-fit mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Incident Classifier</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes incident narratives using machine learning to detect fraud patterns (UPI scam, fake job, phishing, OTP fraud) and extract actionable threat indicators.
            </p>
          </div>

          <div className="p-6 rounded-2xl cyber-glass border border-slate-800 hover:border-cyan-500/30 transition-all group">
            <div className="p-3 rounded-xl bg-blue-950/50 border border-blue-500/30 text-blue-400 w-fit mb-4 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Suspicious URL Scanner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deep heuristic scanner verifying TLD risks, brand spoofing, punycode characters, and phishing path vectors with an explainable 0–100 risk scoring breakdown.
            </p>
          </div>

          <div className="p-6 rounded-2xl cyber-glass border border-slate-800 hover:border-cyan-500/30 transition-all group">
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 w-fit mb-4 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Evidence & Case Locker</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Store screenshots and receipts with cryptographic SHA-256 integrity checksums. Generate official Cybercrime complaint drafts with a single click.
            </p>
          </div>
        </div>
      </section>

      {/* Incident Workflow */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 border-t border-slate-800/80">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0C1425] to-slate-900 border border-cyan-500/20">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-1">Incident Response Pipeline</h3>
            <p className="text-xs text-slate-400">Structured progression from reporting to resolution</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
            {[
              { step: '01', title: 'Report', desc: '7-Step Wizard' },
              { step: '02', title: 'AI Classify', desc: 'NLP Pipeline' },
              { step: '03', title: 'Risk Score', desc: 'Explainable Score' },
              { step: '04', title: 'Evidence', desc: 'SHA-256 Hashing' },
              { step: '05', title: 'Complaint', desc: 'Draft Generator' },
              { step: '06', title: 'Resolution', desc: 'Live Case Tracking' }
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs font-mono font-bold text-cyan-400 mb-1">{s.step}</div>
                <div className="text-xs font-bold text-white">{s.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
