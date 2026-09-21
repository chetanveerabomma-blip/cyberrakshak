import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, FileText, CheckCircle, Clock, Plus, ExternalLink, Globe, ArrowRight, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function DashboardPage({ setActiveTab, setSelectedCaseId }) {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getIncidents().catch(() => []),
      api.getCases().catch(() => [])
    ]).then(([incList, caseList]) => {
      setIncidents(incList || []);
      setCases(caseList || []);
    }).finally(() => setLoading(false));
  }, []);

  const totalReports = incidents.length;
  const activeCases = cases.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
  const highRiskCount = incidents.filter(i => i.riskLevel === 'HIGH' || i.riskLevel === 'CRITICAL').length;
  const resolvedCount = cases.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 border border-red-500/40 text-red-400">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 border border-amber-500/40 text-amber-400">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 border border-sky-500/40 text-sky-400">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">LOW</span>;
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 border border-slate-700 text-slate-300">
        {status?.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <span>Welcome back, {user?.name}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Incident Response & Citizen Cyber Protection Dashboard</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('url-scanner')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Scan URL</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white text-xs font-bold shadow-neon-danger flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl cyber-glass border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Reports</span>
            <div className="p-2 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">{totalReports}</div>
          <div className="text-[10px] text-slate-500 mt-1">Lodge new case anytime</div>
        </div>

        <div className="p-5 rounded-2xl cyber-glass border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Cases</span>
            <div className="p-2 rounded-lg bg-sky-950/40 text-sky-400 border border-sky-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400 mt-2">{activeCases}</div>
          <div className="text-[10px] text-slate-500 mt-1">In progress & investigation</div>
        </div>

        <div className="p-5 rounded-2xl cyber-glass border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">High-Risk Threats</span>
            <div className="p-2 rounded-lg bg-red-950/40 text-red-400 border border-red-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-red-400 mt-2">{highRiskCount}</div>
          <div className="text-[10px] text-slate-500 mt-1">High or Critical urgency</div>
        </div>

        <div className="p-5 rounded-2xl cyber-glass border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Resolved Cases</span>
            <div className="p-2 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">{resolvedCount}</div>
          <div className="text-[10px] text-slate-500 mt-1">Action completed</div>
        </div>
      </div>

      {/* Recent Incidents Table */}
      <div className="p-6 rounded-2xl cyber-glass border border-slate-800 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Recent Incident Reports</h2>
            <p className="text-xs text-slate-400">Track cases and view AI classification assessments</p>
          </div>
          <button
            onClick={() => setActiveTab('cases')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading incident records...</div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
            <Shield className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-300">No incident reports yet</div>
            <p className="text-xs text-slate-500 mt-1">Report an incident to get AI classification and legal complaint draft.</p>
            <button
              onClick={() => setActiveTab('report')}
              className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold"
            >
              Report Incident
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Incident ID</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Financial Loss</th>
                  <th className="px-4 py-3">Threat Level</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {incidents.slice(0, 6).map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-semibold text-cyan-400">{inc.incidentId}</td>
                    <td className="px-4 py-3.5 font-medium text-white">{inc.category?.replace('_', ' ')}</td>
                    <td className="px-4 py-3.5 text-slate-400">{inc.incidentDate || 'Recent'}</td>
                    <td className="px-4 py-3.5 font-mono">
                      {inc.financialLoss > 0 ? (
                        <span className="text-rose-400 font-semibold">₹{inc.financialLoss.toLocaleString()}</span>
                      ) : (
                        <span className="text-slate-500">Nil</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">{getRiskBadge(inc.riskLevel)}</td>
                    <td className="px-4 py-3.5">{getStatusBadge(inc.status)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedCaseId(inc.incidentId.replace('INC-', ''));
                          setActiveTab('case-detail');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition-colors"
                      >
                        View Case
                      </button>
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
