import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Info } from 'lucide-react';

export default function RiskGauge({ score = 50, level = 'MEDIUM', reasons = [], actions = [] }) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getColor = (s) => {
    if (s >= 75) return { stroke: '#EF4444', text: 'text-red-500', bg: 'bg-red-950/40', border: 'border-red-500/30' };
    if (s >= 50) return { stroke: '#F59E0B', text: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-500/30' };
    if (s >= 25) return { stroke: '#38BDF8', text: 'text-sky-400', bg: 'bg-sky-950/40', border: 'border-sky-500/30' };
    return { stroke: '#10B981', text: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-500/30' };
  };

  const theme = getColor(normalizedScore);

  return (
    <div className="p-6 rounded-2xl cyber-glass border border-slate-800">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
        
        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="#1E293B"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke={theme.stroke}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-white font-mono">{normalizedScore}</span>
            <span className="text-[11px] text-slate-400 font-mono">/ 100</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${theme.text}`}>{level}</span>
          </div>
        </div>

        {/* Level Overview */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2 mb-1">
            <ShieldAlert className={`w-5 h-5 ${theme.text}`} />
            <h3 className="text-lg font-bold text-white">Threat Level: <span className={theme.text}>{level} RISK</span></h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {normalizedScore >= 75
              ? 'Critical urgency: Direct financial loss or critical authentication credentials exposed. Immediate containment advised.'
              : normalizedScore >= 50
              ? 'High threat: Direct attack vector detected with sensitive banking or deception indicators.'
              : 'Moderate risk assessed. Follow preventative containment guidelines.'}
          </p>
        </div>
      </div>

      {/* Explainability: Why was this score generated? */}
      {reasons && reasons.length > 0 && (
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Why was this score generated? (Explainable Factors)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {reasons.map((r, i) => (
              <div key={i} className="flex items-start space-x-2 text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                <span className="text-cyan-400 font-mono mt-0.5">•</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Immediate Actions */}
      {actions && actions.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Recommended Immediate Actions</span>
          </div>
          <ul className="space-y-1.5">
            {actions.map((act, i) => (
              <li key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
