import React from 'react';
import { CheckCircle2, Clock, Shield, Search, FileText, CheckCheck, AlertCircle } from 'lucide-react';

export default function TimelineView({ timeline = [], currentStatus = 'SUBMITTED' }) {
  const getStageIcon = (stage) => {
    switch (stage) {
      case 'REPORT_SUBMITTED':
      case 'SUBMITTED':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'AI_CLASSIFIED':
        return <Shield className="w-4 h-4 text-sky-400" />;
      case 'RISK_ASSESSED':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'ASSIGNED':
      case 'UNDER_REVIEW':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'INVESTIGATION':
        return <Search className="w-4 h-4 text-purple-400" />;
      case 'RESOLVED':
      case 'CLOSED':
        return <CheckCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
      {timeline.map((event, index) => {
        const isLatest = index === timeline.length - 1;
        return (
          <div key={index} className="relative group">
            {/* Dot / Icon container */}
            <div className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
              isLatest 
                ? 'bg-cyan-950 border-cyan-400 shadow-neon-cyan' 
                : 'bg-slate-900 border-slate-700'
            }`}>
              {getStageIcon(event.stage)}
            </div>

            {/* Event content */}
            <div className={`p-4 rounded-xl transition-all ${
              isLatest 
                ? 'bg-cyan-950/20 border border-cyan-500/30' 
                : 'bg-slate-900/40 border border-slate-800/80'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <span className="text-sm font-bold text-white">{event.title}</span>
                <span className="text-[11px] font-mono text-slate-400">
                  {event.timestamp ? new Date(event.timestamp).toLocaleString() : ''}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{event.description}</p>
              {event.updatedBy && (
                <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                  <span>Updated by:</span>
                  <span className="text-cyan-400 font-medium">{event.updatedBy}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
