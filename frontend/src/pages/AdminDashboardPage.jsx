import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, Users, Database, Activity, 
  MapPin, CheckCircle2, Search, Cpu, FileText, Lock, UserCheck 
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboardPage({ setSelectedCaseId, setActiveTab }) {
  const [analytics, setAnalytics] = useState(null);
  const [scamPatterns, setScamPatterns] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [activeAdminTab, setActiveAdminTab] = useState('analytics'); // analytics, patterns, logs, users
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAnalytics().catch(() => null),
      api.getScamPatterns().catch(() => []),
      api.getAuditLogs().catch(() => []),
      api.getUsers().catch(() => [])
    ]).then(([analyticsData, patterns, logs, users]) => {
      setAnalytics(analyticsData);
      setScamPatterns(patterns || []);
      setAuditLogs(logs || []);
      setUsersList(users || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-medium mb-2">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Cyber Command Center</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Administrator & Cyber Officer Telemetry</h1>
          <p className="text-xs text-slate-400 mt-1">Incident monitoring, scam clustering, audit compliance, and resource allocation</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveAdminTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeAdminTab === 'analytics' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics & Heatmap
          </button>
          <button
            onClick={() => setActiveAdminTab('patterns')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeAdminTab === 'patterns' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Scam Patterns ({scamPatterns.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeAdminTab === 'logs' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeAdminTab === 'users' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Users ({usersList.length})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="p-4 rounded-2xl cyber-glass border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400">Total Incidents</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">{analytics.totalIncidents}</div>
            <div className="text-[10px] text-slate-500 mt-1">Across all vectors</div>
          </div>

          <div className="p-4 rounded-2xl cyber-glass border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400">Total Financial Loss</span>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-1">₹{analytics.totalFinancialLoss?.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500 mt-1">Reported loss amount</div>
          </div>

          <div className="p-4 rounded-2xl cyber-glass border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400">Critical Threats</span>
            <div className="text-2xl font-bold font-mono text-red-500 mt-1">{analytics.criticalRiskIncidents}</div>
            <div className="text-[10px] text-slate-500 mt-1">Immediate action needed</div>
          </div>

          <div className="p-4 rounded-2xl cyber-glass border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400">Resolved Ratio</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {analytics.totalCases > 0 ? Math.round((analytics.resolvedCases / analytics.totalCases) * 100) : 0}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{analytics.resolvedCases} of {analytics.totalCases} resolved</div>
          </div>

          <div className="p-4 rounded-2xl cyber-glass border border-slate-800 col-span-2 md:col-span-1">
            <span className="text-[11px] font-semibold text-slate-400">Avg Response Time</span>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{analytics.avgResponseTimeHours} hrs</div>
            <div className="text-[10px] text-slate-500 mt-1">Golden hour adherence</div>
          </div>
        </div>
      )}

      {/* TAB 1: ANALYTICS & STATE HEATMAP */}
      {activeAdminTab === 'analytics' && analytics && (
        <div className="space-y-8 animate-in fade-in">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Category Breakdown Bar */}
            <div className="p-6 rounded-2xl cyber-glass border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Incident Distribution by Scam Category</span>
              </h3>
              <div className="space-y-2.5 text-xs">
                {Object.entries(analytics.categoryDistribution || {}).map(([cat, count]) => {
                  const pct = Math.round((count / (analytics.totalIncidents || 1)) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                        <span>{cat.replace('_', ' ')}</span>
                        <span className="font-mono text-cyan-400">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                          style={{ width: `${Math.max(pct, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Geographic Distribution Across Indian States */}
            <div className="p-6 rounded-2xl cyber-glass border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Geographic Incident Heatmap (State Aggregations)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mb-3">
                Anonymized territorial density used for targeted cyber cell enforcement without revealing victim private addresses.
              </p>
              <div className="space-y-2 text-xs">
                {Object.entries(analytics.stateDistribution || {}).map(([state, count]) => {
                  const pct = Math.round((count / (analytics.totalIncidents || 1)) * 100);
                  return (
                    <div key={state} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="font-bold text-slate-200">{state}</span>
                      </div>
                      <span className="font-mono text-xs text-emerald-400 font-bold">{count} incidents ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EMERGING SCAM PATTERN DETECTION */}
      {activeAdminTab === 'patterns' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-6 rounded-2xl cyber-glass border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Multi-Vector Scam Pattern & Clustering Engine</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Detects repeated domains, fraudulent phone numbers, and payment VPAs appearing across multiple victim reports.
            </p>

            <div className="space-y-3">
              {scamPatterns.map((pat, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                        {pat.type?.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">{pat.indicator}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Recommended Action: <strong className="text-slate-200">{pat.recommendation}</strong></p>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <span className="text-slate-400">Reports: <strong className="text-cyan-400">{pat.occurrences}</strong></span>
                    <span className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-500/30 text-red-400 font-bold">
                      {pat.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeAdminTab === 'logs' && (
        <div className="p-6 rounded-2xl cyber-glass border border-slate-800 animate-in fade-in">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Immutable Administrative Audit Trail</span>
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Append-only tamper-resistant log tracking officer assignments, status transitions, and evidence inspections for legal compliance.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {auditLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()} {new Date(log.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-cyan-400">{log.actorEmail}</td>
                    <td className="px-4 py-3 font-bold text-slate-200">{log.action}</td>
                    <td className="px-4 py-3 text-slate-400">{log.resource}:{log.resourceId}</td>
                    <td className="px-4 py-3 text-slate-300 font-sans max-w-xs truncate">{log.details}</td>
                    <td className="px-4 py-3 text-slate-500">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: USERS MANAGEMENT */}
      {activeAdminTab === 'users' && (
        <div className="p-6 rounded-2xl cyber-glass border border-slate-800 animate-in fade-in">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>User Directory & Role Authorization</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40">
                    <td className="px-4 py-3 font-bold text-white">{u.name}</td>
                    <td className="px-4 py-3 text-cyan-400 font-mono">{u.email}</td>
                    <td className="px-4 py-3 text-slate-400">{u.phone || 'N/A'}</td>
                    <td className="px-4 py-3 font-mono text-purple-300">{u.role}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
