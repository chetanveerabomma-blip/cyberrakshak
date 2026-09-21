import React from 'react';
import { X, Printer, Download, Copy, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ComplaintModal({ draft, onClose }) {
  if (!draft) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(draft.formattedComplaintText);
    alert('Complaint draft copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([draft.formattedComplaintText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Cybercrime_Complaint_Draft_${draft.incidentId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#090E1A] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Official Cybercrime Complaint Draft</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-amber-950/40 border-b border-amber-500/30 px-6 py-3 flex items-start space-x-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Citizen Guidance:</strong> This is a structured complaint draft prepared with chronological facts and digital evidence hashes. Please print or copy this draft and formally submit it on <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="underline font-bold text-amber-300">cybercrime.gov.in</a> or at your nearest Cyber Crime Police Station.
          </span>
        </div>

        {/* Content area */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-xs text-slate-300 bg-[#060912] leading-relaxed whitespace-pre-wrap selection:bg-cyan-500/30">
          {draft.formattedComplaintText}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/80">
          <div className="text-xs text-slate-400">
            Evidence Attached: <span className="text-cyan-400 font-bold">{draft.evidenceCount || 0}</span> files
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Text</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Draft</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center space-x-1.5 shadow-neon-cyan transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .TXT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
