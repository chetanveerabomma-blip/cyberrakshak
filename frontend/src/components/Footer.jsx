import React from 'react';
import { Shield, PhoneCall, ExternalLink, AlertOctagon, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050811] border-t border-slate-800/80 text-slate-400 text-xs py-10 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Emergency Helpline Banner */}
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/40 border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/40 animate-pulse">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">National Cyber Crime Helpline: Dial 1930</div>
              <p className="text-slate-400 text-xs">Call within the 'Golden Hour' (2-3 hrs) to freeze unauthorized financial fraud transactions across banks.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <a 
              href="https://cybercrime.gov.in" 
              target="_blank" 
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://sancharsaathi.gov.in" 
              target="_blank" 
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <span>Chakshu (DoT)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-sm mb-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>CyberRakshak</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              An advanced citizen cyber defense & incident-response platform. Detect. Report. Respond. Stay Safe.
            </p>
          </div>

          <div>
            <div className="text-slate-200 font-semibold text-xs mb-2 uppercase tracking-wider">Incident Vectors</div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>UPI & QR Code Frauds</li>
              <li>Phishing & SMS Spoofing</li>
              <li>Telegram & Part-Time Job Scams</li>
              <li>Fake Investment Platforms</li>
              <li>Account Takeover & SIM Swap</li>
            </ul>
          </div>

          <div>
            <div className="text-slate-200 font-semibold text-xs mb-2 uppercase tracking-wider">Official Portals</div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="hover:text-cyan-400">National Cybercrime Portal</a></li>
              <li><a href="https://sancharsaathi.gov.in" target="_blank" rel="noreferrer" className="hover:text-cyan-400">Sanchar Saathi (Chakshu)</a></li>
              <li><a href="https://uidai.gov.in" target="_blank" rel="noreferrer" className="hover:text-cyan-400">UIDAI Aadhaar Lock</a></li>
              <li><a href="https://cibil.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400">CIBIL Credit Inquiry</a></li>
            </ul>
          </div>

          <div>
            <div className="text-slate-200 font-semibold text-xs mb-2 uppercase tracking-wider">Legal Notice</div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              CyberRakshak is an educational and preliminary incident assistance tool. It generates structured complaint drafts and preserves digital evidence hashes; it does not replace official police FIRs or bank fraud dispute forms.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div>© 2026 CyberRakshak — Advanced Cybersecurity Incident Management</div>
          <div className="flex items-center space-x-1">
            <span>Built for Cyber Resilience in India</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 ml-1"></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
