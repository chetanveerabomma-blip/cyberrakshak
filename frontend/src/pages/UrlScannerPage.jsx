import React, { useState, useEffect } from 'react';
import { Globe, Search, AlertTriangle, CheckCircle, ShieldAlert, Trash2, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function UrlScannerPage() {
  const { user } = useAuth();
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Check if a quick scan URL was stored from landing page
    const pending = sessionStorage.getItem('pending_scan_url');
    if (pending) {
      sessionStorage.removeItem('pending_scan_url');
      setUrlInput(pending);
      triggerScan(pending);
    }

    // Load user scan history
    if (user) {
      api.getUrlHistory().then(setHistory).catch(() => {});
    } else {
      api.getRecentUrls().then(setHistory).catch(() => {});
    }
  }, [user]);

  const triggerScan = async (targetUrl) => {
    if (!targetUrl.trim()) return;
    setLoading(true);
    try {
      const res = await api.scanUrl(targetUrl.trim());
      setCurrentResult(res);
      setHistory(prev => [res, ...prev.filter(h => h.scanId !== res.scanId)]);
    } catch (err) {
      alert(err.message || 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerScan(urlInput);
  };

  const handleDelete = async (scanId) => {
    try {
      await api.deleteUrlScan(scanId);
      setHistory(prev => prev.filter(h => h.scanId !== scanId));
      if (currentResult?.scanId === scanId) {
        setCurrentResult(null);
      }
    } catch {
      // fallback
    }
  };

  const sampleUrls = [
    { label: 'Phishing SBI Portal', url: 'http://sbi-kyc-verification.top/login.php?user=victim' },
    { label: 'Fake HDFC Update', url: 'http://hdfc-pan-update.xyz/verify' },
    { label: 'Official Gov Portal', url: 'https://cybercrime.gov.in' }
  ];

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-3">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Heuristic URL Threat Scanner</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Suspicious URL Analyzer</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto">
          Scan suspicious SMS links, social media offers, or fake banking websites for phishing vectors, brand spoofing, and malicious domain signatures.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="p-2 rounded-2xl bg-[#090F1C] border border-cyan-500/40 shadow-neon-cyan flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center flex-1 w-full px-3">
            <Globe className="w-5 h-5 text-cyan-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter full website link (e.g. http://bank-kyc-update.top/login)..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none py-2 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-neon-cyan transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Analyzing Telemetry...' : 'Analyze URL'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Sample presets */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs">
        <span className="text-slate-500">Quick Test Cases:</span>
        {sampleUrls.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setUrlInput(s.url);
              triggerScan(s.url);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-cyan-300 border border-slate-800 transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Scan Result Card */}
      {currentResult && (
        <div className="p-6 rounded-2xl cyber-glass border border-slate-800 mb-8 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-[10px] text-slate-500 font-mono">Scan Reference: {currentResult.scanId}</div>
              <div className="text-sm font-bold text-white font-mono break-all mt-0.5">{currentResult.url}</div>
              <div className="text-xs text-slate-400 mt-1">Domain Host: <span className="text-cyan-400">{currentResult.domain || 'N/A'}</span></div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Threat Score</div>
                <div className="text-2xl font-bold font-mono text-white">{currentResult.score} <span className="text-xs text-slate-500">/ 100</span></div>
              </div>
              <div className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase border ${
                currentResult.score >= 75 ? 'bg-red-950 text-red-400 border-red-500/40' :
                currentResult.score >= 50 ? 'bg-amber-950 text-amber-400 border-amber-500/40' :
                currentResult.score >= 25 ? 'bg-sky-950 text-sky-400 border-sky-500/40' :
                'bg-emerald-950 text-emerald-400 border-emerald-500/40'
              }`}>
                {currentResult.riskLevel} RISK
              </div>
            </div>
          </div>

          {/* Explainable Findings */}
          <div className="mt-5">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Heuristic Findings & Indicators:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {currentResult.findings?.map((find, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-slate-300">
                  <span className="text-amber-400 font-bold">!</span>
                  <span>{find}</span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Safety Recommendation:</strong> {currentResult.recommendation}
                <p className="text-[11px] text-slate-500 mt-1 italic">
                  Note: Heuristic analysis assesses patterns and indicators; it does not represent an absolute verdict. Always exercise critical caution.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="p-6 rounded-2xl cyber-glass border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4">Recent URL Scans</h3>
        {history.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">No URL scans in history.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3">Scan ID</th>
                  <th className="px-4 py-3">Scanned URL</th>
                  <th className="px-4 py-3">Threat Score</th>
                  <th className="px-4 py-3">Risk Level</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((h) => (
                  <tr key={h.scanId} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-cyan-400">{h.scanId}</td>
                    <td className="px-4 py-3 font-mono text-slate-200 max-w-xs truncate">{h.url}</td>
                    <td className="px-4 py-3 font-mono font-bold">{h.score}/100</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        h.riskLevel === 'CRITICAL' ? 'bg-red-950 text-red-400' :
                        h.riskLevel === 'HIGH' ? 'bg-amber-950 text-amber-400' :
                        'bg-emerald-950 text-emerald-400'
                      }`}>
                        {h.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setCurrentResult(h);
                            setUrlInput(h.url);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold"
                        >
                          View
                        </button>
                        {user && (
                          <button
                            onClick={() => handleDelete(h.scanId)}
                            className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                            title="Delete scan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
