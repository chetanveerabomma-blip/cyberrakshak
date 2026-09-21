import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Shield, FileText, CheckCircle2, AlertTriangle, 
  Download, Clock, MessageSquare, Plus, Lock, UserCheck, ShieldCheck 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TimelineView from '../components/TimelineView';
import ComplaintModal from '../components/ComplaintModal';

export default function CaseDetailPage({ caseId, setActiveTab }) {
  const { user, isStaff } = useAuth();
  const [caseData, setCaseData] = useState(null);
  const [incidentData, setIncidentData] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [complaintDraft, setComplaintDraft] = useState(null);

  // Officer inputs
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [newNote, setNewNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!caseId) return;

    api.getCaseById(caseId)
      .then(async (c) => {
        setCaseData(c);
        setNewStatus(c.status);

        if (c.incidentId) {
          try {
            const inc = await api.getIncidentById(c.incidentId);
            setIncidentData(inc);
            const evs = await api.getEvidenceForCase(c.caseId).catch(() => []);
            setEvidenceList(evs || []);
          } catch {
            // fallback
          }
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [caseId]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!newStatus) return;
    setUpdating(true);
    try {
      const updated = await api.updateCaseStatus(caseId, {
        status: newStatus,
        note: statusNote || `Status updated to ${newStatus}`
      });
      setCaseData(updated);
      setStatusNote('');
      alert('Case status updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setUpdating(true);
    try {
      const updated = await api.addCaseNote(caseId, newNote.trim());
      setCaseData(updated);
      setNewNote('');
    } catch (err) {
      alert(err.message || 'Failed to add note');
    } finally {
      setUpdating(false);
    }
  };

  const handleGenerateComplaint = async () => {
    try {
      const draft = await api.getComplaintDraft(caseId);
      setComplaintDraft(draft);
    } catch (err) {
      alert('Failed to generate complaint draft: ' + err.message);
    }
  };

  const handleVerifyEvidence = async (evId) => {
    try {
      const res = await api.verifyIntegrity(evId);
      alert(`Integrity Check: ${res.status}\nSHA-256 Hash Match: ${res.integrityVerified ? 'VERIFIED' : 'FAILED'}`);
    } catch (err) {
      alert('Verification failed: ' + err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xs text-slate-400">Loading case file telemetry...</div>;
  }

  if (!caseData) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-bold text-white mb-2">Case Record Not Found</h3>
        <button
          onClick={() => setActiveTab('cases')}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs"
        >
          Return to Case List
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb */}
      <button
        onClick={() => setActiveTab('cases')}
        className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Cases</span>
      </button>

      {/* Case Header Card */}
      <div className="p-6 rounded-2xl cyber-glass border border-slate-800 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-extrabold text-white font-mono">{caseData.caseId}</h1>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                caseData.riskLevel === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/30' :
                caseData.riskLevel === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
              }`}>
                {caseData.riskLevel} RISK
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Category: <strong className="text-white">{caseData.category?.replace('_', ' ')}</strong> | Incident ID: <span className="font-mono text-cyan-400">{caseData.incidentId}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleGenerateComplaint}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center space-x-1.5 shadow-neon-cyan transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Complaint Draft</span>
            </button>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-xs">
          <div>
            <span className="text-slate-500 block">Complainant:</span>
            <strong className="text-slate-200">{caseData.complainantName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Current Status:</span>
            <strong className="text-cyan-400">{caseData.status?.replace('_', ' ')}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Assigned Officer:</span>
            <strong className="text-slate-200">{caseData.assignedOfficerName || 'Under Triage'}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Registered On:</span>
            <strong className="text-slate-200">{new Date(caseData.createdAt).toLocaleDateString()}</strong>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left Timeline, Right Actions/Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Timeline & Incident Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Timeline View */}
          <div className="p-6 rounded-2xl cyber-glass border border-slate-800">
            <h2 className="text-sm font-bold text-white mb-6 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Visual Case Progression Timeline</span>
            </h2>
            <TimelineView timeline={caseData.timeline || []} currentStatus={caseData.status} />
          </div>

          {/* Incident Description & Telemetry */}
          {incidentData && (
            <div className="p-6 rounded-2xl cyber-glass border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3">Incident Statement & Financial Impact</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-4 font-mono">
                {incidentData.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Financial Loss:</span>
                  <span className="text-rose-400 font-bold font-mono">₹{incidentData.financialLoss?.toLocaleString() || '0.00'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Transaction ID:</span>
                  <span className="font-mono text-slate-300">{incidentData.transactionId || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Payment App:</span>
                  <span className="text-slate-300">{incidentData.paymentMethod || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Suspect Phone / VPA:</span>
                  <span className="font-mono text-slate-300">{incidentData.suspectPhone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Bank / Provider:</span>
                  <span className="text-slate-300">{incidentData.bankName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Jurisdiction State:</span>
                  <span className="text-slate-300">{incidentData.state || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Evidence Locker, Officer Triage, and Notes */}
        <div className="space-y-8">
          
          {/* Officer Management Controls (if staff) */}
          {isStaff && (
            <div className="p-6 rounded-2xl cyber-glass border border-purple-500/30">
              <h3 className="text-sm font-bold text-purple-300 mb-3 flex items-center space-x-1.5">
                <UserCheck className="w-4 h-4" />
                <span>Officer Investigation Triage</span>
              </h3>

              <form onSubmit={handleStatusUpdate} className="space-y-3 mb-6">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Update Status:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="SUBMITTED">Submitted</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="EVIDENCE_REQUIRED">Evidence Required</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="INVESTIGATION">Investigation</option>
                    <option value="ACTION_RECOMMENDED">Action Recommended</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Status Transition Note:</label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Telemetry verified with bank nodal officer"
                    className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors disabled:opacity-50"
                >
                  Update Case Status
                </button>
              </form>

              {/* Add Officer Note */}
              <form onSubmit={handleAddNote} className="pt-4 border-t border-slate-800 space-y-2">
                <label className="block text-xs text-slate-300">Add Confidential Officer Note:</label>
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record investigation notes, CDR tracking, or bank nodal reference..."
                  className="w-full bg-slate-950 text-slate-100 text-xs p-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={updating || !newNote.trim()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  + Add Investigation Note
                </button>
              </form>
            </div>
          )}

          {/* Investigation Notes Feed */}
          {caseData.officerNotes && caseData.officerNotes.length > 0 && (
            <div className="p-6 rounded-2xl cyber-glass border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Officer Investigation Notes</span>
              </h3>
              <div className="space-y-2">
                {caseData.officerNotes.map((note, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 font-mono">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Locker */}
          <div className="p-6 rounded-2xl cyber-glass border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Evidence Locker</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Cryptographically preserved attachments with SHA-256 integrity</p>

            {evidenceList.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4">No digital evidence uploaded yet.</div>
            ) : (
              <div className="space-y-3">
                {evidenceList.map((ev, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div className="font-bold text-white break-all">{ev.fileName}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1 break-all">
                      SHA-256: <span className="text-emerald-400">{ev.sha256}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">{(ev.fileSize / 1024).toFixed(1)} KB</span>
                      <button
                        onClick={() => handleVerifyEvidence(ev.evidenceId)}
                        className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold"
                      >
                        Verify Hash
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {complaintDraft && (
        <ComplaintModal draft={complaintDraft} onClose={() => setComplaintDraft(null)} />
      )}
    </div>
  );
}
