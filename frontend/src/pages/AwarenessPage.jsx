import React, { useState, useEffect } from 'react';
import { BookOpen, Shield, CheckCircle2, XCircle, AlertTriangle, Award, RefreshCw, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

const QUIZ_QUESTIONS = [
  {
    q: "A buyer on OLX sends a QR code stating 'Scan this to receive payment for your item'. What should you do?",
    options: [
      "Scan the QR code and enter UPI PIN immediately",
      "Never enter your UPI PIN — PIN is only needed to SEND money, never to receive",
      "Share your bank account OTP instead",
      "Forward the QR code to your friends to test"
    ],
    answer: 1,
    tip: "UPI PIN is solely used for authorizing outgoing debits. You NEVER need to enter your PIN to receive funds."
  },
  {
    q: "You receive an SMS from 'AD-HDFCBK' claiming your account will be suspended unless you click a link ending in '.top'. What is the safest action?",
    options: [
      "Click the link and quickly submit your net banking password",
      "Reply with your Aadhaar number to verify",
      "Ignore the link, delete the SMS, and verify with your bank using the official helpline number on your card",
      "Call the mobile number mentioned in the SMS"
    ],
    answer: 2,
    tip: "Banks never send urgent threats with non-official short links. Official bank SMS headers are strictly registered with TRAI."
  },
  {
    q: "Someone offering a remote 'YouTube Video Liking Job' asks you to join a Telegram group and pay a Rs 5,000 'VIP Task Deposit'. This is:",
    options: [
      "A legitimate freelancing opportunity",
      "A classic prepaid task investment scam that will cause total financial loss",
      "Government-sponsored skill program",
      "Standard freelance security deposit"
    ],
    answer: 1,
    tip: "Legitimate employers never demand advance security deposits or task fees. Any job asking you to pay to work is a scam."
  },
  {
    q: "A caller claiming to be a police officer or customs agent on Skype claims you are under 'Digital Arrest' for an illegal courier. What is the legal truth?",
    options: [
      "Indian law allows digital arrest over video calls",
      "There is NO legal concept of 'Digital Arrest' in India — police never arrest people on video calls or demand money",
      "You should transfer money to their 'RBI verification account'",
      "You must stay on the Skype call for 24 hours"
    ],
    answer: 1,
    tip: "The Ministry of Home Affairs has reiterated: No law enforcement agency ever conducts 'digital arrests' or requests money transfers."
  },
  {
    q: "What is the emergency helpline number in India for financial cyber fraud reporting within the 'Golden Hour'?",
    options: [
      "100",
      "1930",
      "1098",
      "112"
    ],
    answer: 1,
    tip: "Dial 1930 immediately to trigger transaction hold protocols with participating banks and payment gateways."
  }
];

export default function AwarenessPage() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    api.getAwarenessArticles()
      .then(data => {
        setArticles(data || []);
        if (data && data.length > 0) {
          setSelectedArticle(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleAnswer = (optionIdx) => {
    setSelectedOption(optionIdx);
    if (optionIdx === QUIZ_QUESTIONS[currentQIndex].answer) {
      setScore(prev => prev + 20);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
    setActiveQuiz(true);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-3">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Citizen Cyber Defense Academy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Cyber Awareness & Threat Prevention</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto">
          Equip yourself with practical cybersecurity knowledge to recognize social engineering, UPI traps, and online impersonation scams.
        </p>
      </div>

      {/* Cyber Safety Score Quiz Card Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 border border-cyan-500/30 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-neon-cyan flex-shrink-0">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Check Your Personal Cyber Safety Score</h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Take our interactive 5-question awareness assessment based on real-world Indian cyber crime scenarios and receive a personalized safety rating.
            </p>
          </div>
        </div>

        <button
          onClick={() => { setActiveQuiz(true); setQuizFinished(false); setCurrentQIndex(0); setScore(0); }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-black font-bold text-xs shadow-neon-cyan transition-all whitespace-nowrap"
        >
          Take Safety Assessment
        </button>
      </div>

      {/* Interactive Quiz Modal / View */}
      {activeQuiz && (
        <div className="p-6 rounded-2xl cyber-glass border border-cyan-500/40 mb-8 animate-in fade-in">
          {!quizFinished ? (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  Question {currentQIndex + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-xs font-mono text-slate-400">Current Score: {score}/100</span>
              </div>

              <h3 className="text-base font-bold text-white mb-4">
                {QUIZ_QUESTIONS[currentQIndex].q}
              </h3>

              <div className="space-y-2 mb-6">
                {QUIZ_QUESTIONS[currentQIndex].options.map((opt, idx) => {
                  const isAnswered = selectedOption !== null;
                  const isCorrect = idx === QUIZ_QUESTIONS[currentQIndex].answer;
                  const isChosen = idx === selectedOption;

                  let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-850 hover:border-slate-700';
                  if (isAnswered) {
                    if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 font-bold';
                    else if (isChosen) btnStyle = 'bg-red-950/80 border-red-500/60 text-red-300';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-6 animate-in fade-in">
                  <span className="text-cyan-400 font-bold">Key Safety Insight: </span>
                  {QUIZ_QUESTIONS[currentQIndex].tip}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  disabled={selectedOption === null}
                  onClick={handleNextQuestion}
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold text-xs transition-all flex items-center space-x-1.5"
                >
                  <span>{currentQIndex === QUIZ_QUESTIONS.length - 1 ? 'Finish Assessment' : 'Next Question'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex p-4 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 mb-3">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">Your Cyber Safety Score</h3>
              <div className="text-4xl font-extrabold font-mono text-cyan-400 my-2">{score} / 100</div>
              <p className="text-xs text-slate-300 max-w-md mx-auto mb-6">
                {score >= 80 ? 'Excellent! You possess strong threat detection reflexes against financial fraud and phishing.' :
                 score >= 60 ? 'Good awareness, but remain vigilant when dealing with urgent payment demands and OTP calls.' :
                 'Vulnerable to social engineering. We highly recommend reviewing our safety guides below.'}
              </p>
              <button
                onClick={resetQuiz}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Guides & Knowledge Base */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article Selector List */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Safety Guide Topics</h3>
          {articles.map((art) => (
            <div
              key={art.slug}
              onClick={() => setSelectedArticle(art)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                selectedArticle?.slug === art.slug
                  ? 'bg-cyan-950/50 border-cyan-400 shadow-neon-cyan'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] text-cyan-400 uppercase font-mono font-bold">{art.category?.replace('_', ' ')}</div>
              <div className="text-xs font-bold text-white mt-0.5">{art.title}</div>
            </div>
          ))}
        </div>

        {/* Selected Article Content */}
        {selectedArticle && (
          <div className="lg:col-span-2 p-6 rounded-2xl cyber-glass border border-slate-800">
            <div className="text-[10px] text-cyan-400 uppercase font-mono font-bold mb-1">
              {selectedArticle.category?.replace('_', ' ')}
            </div>
            <h2 className="text-xl font-bold text-white mb-3">{selectedArticle.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6 whitespace-pre-wrap">
              {selectedArticle.content}
            </p>

            {/* Warning Signs */}
            {selectedArticle.warningSigns && selectedArticle.warningSigns.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Red Flag Warning Signs</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedArticle.warningSigns.map((w, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Do's and Don'ts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedArticle.dos && (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Safe Practices (Do's)</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {selectedArticle.dos.map((d, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedArticle.donts && (
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Dangerous Traps (Don'ts)</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {selectedArticle.donts.map((d, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-red-400 font-bold">✗</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
