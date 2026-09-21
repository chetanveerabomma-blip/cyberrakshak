import React, { useState } from 'react';
import { Search, Shield, Clock, AlertTriangle, ArrowRight, CheckCircle2, User } from 'lucide-react';
import { api } from '../services/api';
import TimelineView from '../components/TimelineView';

export default function TrackCasePage({ setSelectedCaseId, setActiveTab }) {
  const [caseIdInput, setCaseIdInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [caseRecord, setCaseRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!caseIdInput.trim()) return;

    setError('');
    setLoading(true);
    try {
      const res = await api.trackCasePublic(caseIdInput.trim(), emailInput.trim());
      setCaseRecord(res);
    } catch (err) {
      setError(err.message || 'No case found matching this reference ID');
      setCaseRecord(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-3">
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Citizen Case Telemetry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Track My Cyber Incident Case</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
          Enter your unique Case ID (e.g. CR-2026-000101) and registered email to check live investigation stage, timeline, and recommended actions.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="p-6 rounded-2xl cyber-glass border border-slate-800 max-w-2xl mx-auto mb-8 shadow-2xl">
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Case Reference ID <span className="text-cyan-400">*</span></label>
            <input
              type="text"
              required
              value={caseIdInput}
              onChange={(e) => setCaseIdInput(e.target.value)}
              placeholder="e.g. CR-2026-000101"
              className="w-full bg-slate-950 text-slate-100 font-mono text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400 transition-colors uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Complainant Registered Email (Optional Verification)</label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="complainant@example.com"
              className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-black font-bold text-xs shadow-neon-cyan flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Querying Incident Ledger...' : 'Track Case'}</span>
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Case Found Result */}
      {caseRecord && (
        <div className="p-6 rounded-2xl cyber-glass border border-slate-800 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase">Case Reference</div>
              <h2 className="text-xl font-bold font-mono text-white mt-0.5">{caseRecord.caseId}</h2>
              <div className="text-xs text-slate-400 mt-1">
                Category: <strong className="text-cyan-400">{caseRecord.category?.replace('_', ' ')}</strong>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                caseRecord.riskLevel === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/40' :
                caseRecord.riskLevel === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
                'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
              }`}>
                {caseRecord.riskLevel} RISK
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold">
                Status: {caseRecord.status?.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Official Incident Timeline:</h3>
            <TimelineView timeline={caseRecord.timeline || []} currentStatus={caseRecord.status} />
          </div>

          {/* Citizen action checklist */}
          {caseRecord.citizenActionChecklist && caseRecord.citizenActionChecklist.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 mb-6">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Required Citizen Actions:</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {caseRecord.citizenActionChecklist.map((act, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
