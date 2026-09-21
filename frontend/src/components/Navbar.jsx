import React, { useState } from 'react';
import { Shield, AlertTriangle, Search, BookOpen, User, LogOut, Bell, LayoutDashboard, FileText, Globe, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout, isStaff } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#070B14]/90 backdrop-blur-md border-b border-slate-800">
      {/* Subtle National Tricolour Accent Line */}
      <div className="h-[2px] w-full tricolour-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab(user ? 'dashboard' : 'landing')}
          >
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 group-hover:border-cyan-400 shadow-neon-cyan transition-all">
              <Shield className="w-6 h-6 text-cyan-400" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-wider text-white">CYBER<span className="text-cyan-400">RAKSHAK</span></span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono">v2.0</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">Student & Citizen Cybercrime Assistant</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {user && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'dashboard' ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('report')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'report' ? 'text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-neon-danger' : 'text-rose-400 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/30'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Report Incident</span>
                </button>

                <button
                  onClick={() => setActiveTab('cases')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'cases' ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>My Cases</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('url-scanner')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'url-scanner' ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>URL Scanner</span>
            </button>

            <button
              onClick={() => setActiveTab('track-case')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'track-case' ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Track Case</span>
            </button>

            <button
              onClick={() => setActiveTab('awareness')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'awareness' ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Cyber Awareness</span>
            </button>

            {isStaff && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'admin' ? 'text-purple-300 bg-purple-950/50 border border-purple-500/40 shadow-lg' : 'text-purple-400 bg-purple-950/20 hover:bg-purple-900/30 border border-purple-500/20'
                }`}
              >
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Admin Command</span>
              </button>
            )}
          </nav>

          {/* Right Action / Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-200">{user.name}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">{user.role?.replace('ROLE_', '')}</div>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-950/50 hover:text-red-400 border border-slate-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-neon-cyan transition-all"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0B1324] border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {user && (
            <>
              <button
                onClick={() => { setActiveTab('dashboard'); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
              >
                Dashboard
              </button>
              <button
                onClick={() => { setActiveTab('report'); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-400 font-semibold hover:bg-rose-950/40"
              >
                Report Incident
              </button>
              <button
                onClick={() => { setActiveTab('cases'); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
              >
                My Cases
              </button>
            </>
          )}

          <button
            onClick={() => { setActiveTab('url-scanner'); setMobileOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
          >
            URL Scanner
          </button>
          <button
            onClick={() => { setActiveTab('track-case'); setMobileOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
          >
            Track Case
          </button>
          <button
            onClick={() => { setActiveTab('awareness'); setMobileOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
          >
            Cyber Awareness
          </button>

          {isStaff && (
            <button
              onClick={() => { setActiveTab('admin'); setMobileOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-purple-400 font-semibold hover:bg-purple-950/40"
            >
              Admin Command
            </button>
          )}

          <div className="pt-3 border-t border-slate-800">
            {user ? (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-950/30 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user.name})</span>
              </button>
            ) : (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => { setActiveTab('login'); setMobileOpen(false); }}
                  className="w-full text-center py-2 rounded-lg text-sm bg-slate-800 text-slate-200"
                >
                  Login
                </button>
                <button
                  onClick={() => { setActiveTab('register'); setMobileOpen(false); }}
                  className="w-full text-center py-2 rounded-lg text-sm bg-cyan-400 text-black font-semibold"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
