import React, { useState } from 'react';
import { MessageSquare, X, Send, Shield, Bot, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function AiAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Namaste! I am the **CyberRakshak AI Safety Assistant**.\n\nYou can ask me about:\n• Suspicious UPI / QR requests\n• Phishing links or fake bank KYC SMS\n• Part-time job / Telegram task offers\n• What to do if an OTP or password was shared\n\n*How can I assist your cyber safety today?*"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await api.chatWithAi(userText);
      setMessages((prev) => [...prev, { sender: 'bot', text: res.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "⚠️ Could not connect to AI advisor. For immediate cyber fraud in India, please call **1930** or visit [cybercrime.gov.in](https://cybercrime.gov.in)."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "I received a suspicious UPI request",
    "I clicked a fake bank link",
    "Someone asked for my OTP",
    "Telegram part-time job scam"
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon-cyan hover:scale-105 transition-all flex items-center space-x-2"
        title="CyberRakshak AI Assistant"
      >
        <Bot className="w-6 h-6" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">AI Assistant</span>
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-full max-w-sm sm:max-w-md h-[550px] bg-[#0A101D] border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-1">
                  <span>CyberRakshak AI</span>
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                </div>
                <div className="text-[10px] text-slate-400">Instant Incident Guidance</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-cyan-500 text-black font-medium'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-xl bg-slate-900/90 text-cyan-400 border border-slate-800 flex items-center space-x-2 text-xs">
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>Analyzing cyber incident patterns...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="p-2 border-t border-slate-800/80 bg-slate-950/40 flex overflow-x-auto gap-1.5 no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(prompt);
                }}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 hover:bg-cyan-950/50 text-[10px] text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your situation or ask a question..."
              className="flex-1 bg-slate-950 text-slate-100 placeholder-slate-500 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
