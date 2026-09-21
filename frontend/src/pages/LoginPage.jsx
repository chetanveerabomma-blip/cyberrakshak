import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ setActiveTab }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setActiveTab('dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
      setActiveTab('dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 max-w-md mx-auto my-12 px-4">
      <div className="p-8 rounded-2xl cyber-glass border border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 mb-3 shadow-neon-cyan">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Access Command Center</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to report incidents, track cases and scan URLs</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-950 text-slate-100 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 text-slate-100 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs shadow-neon-cyan transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Instant Demo Accounts */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>1-Click Demo Accounts</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('citizen1@demo.com', 'Password123!')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
            >
              <div className="text-[11px] font-bold text-slate-200">Citizen</div>
              <div className="text-[9px] text-slate-400">Student demo</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('vikram.rathore@cyberrakshak.in', 'Password123!')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-blue-900/50 text-left transition-colors"
            >
              <div className="text-[11px] font-bold text-blue-300">Officer</div>
              <div className="text-[9px] text-slate-400">Inspector demo</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@cyberrakshak.in', 'Password123!')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-purple-900/50 text-left transition-colors"
            >
              <div className="text-[11px] font-bold text-purple-300">Admin</div>
              <div className="text-[9px] text-slate-400">Full telemetry</div>
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-400">
          Don't have an account?{' '}
          <button
            onClick={() => setActiveTab('register')}
            className="text-cyan-400 hover:underline font-semibold"
          >
            Create Citizen Account
          </button>
        </div>
      </div>
    </div>
  );
}
