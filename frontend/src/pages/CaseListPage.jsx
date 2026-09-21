import React, { useState, useEffect } from 'react';
import { FileText, Search, Clock, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function CaseListPage({ setActiveTab, setSelectedCaseId }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    api.getCases()
      .then(data => setCases(data || []))
      .catch(() => setCases([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.caseId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complainantName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Incident Cases</h1>
          <p className="text-xs text-slate-400 mt-1">Lifecycle monitoring, investigation status, and action checklists</p>
        </div>

        <button
          onClick={() => setActiveTab('report')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-neon-danger w-fit"
        >
          + Report New Incident
        </button>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl cyber-glass border border-slate-800 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case ID, Category, or Complainant..."
            className="w-full bg-slate-950 text-slate-100 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400 w-full sm:w-auto"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="INVESTIGATION">Investigation</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Case List Table */}
      <div className="p-6 rounded-2xl cyber-glass border border-slate-800">
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">Loading cases...</div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500">No cases matched your filter criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3">Case ID</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Complainant</th>
                  <th className="px-4 py-3">Assigned Officer</th>
                  <th className="px-4 py-3">Threat</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCases.map((c) => (
                  <tr key={c.caseId} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-cyan-400">{c.caseId}</td>
                    <td className="px-4 py-3.5 font-medium text-white">{c.category?.replace('_', ' ')}</td>
                    <td className="px-4 py-3.5 text-slate-300">{c.complainantName}</td>
                    <td className="px-4 py-3.5 text-slate-400">{c.assignedOfficerName || 'Pending Assignment'}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.riskLevel === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/30' :
                        c.riskLevel === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {c.riskLevel || 'HIGH'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 text-slate-300">
                        {c.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedCaseId(c.caseId);
                          setActiveTab('case-detail');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors flex items-center space-x-1 ml-auto"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
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
