import React, { useState } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  Sparkles,
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Shield,
  Printer
} from 'lucide-react';

export default function ChapterNotesModal({
  chapter,
  notes,
  onClose,
  user
}) {
  const [activeTab, setActiveTab] = useState('formulas');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedFormulaIndex, setCopiedFormulaIndex] = useState(null);
  const [expandedSolutions, setExpandedSolutions] = useState({ 0: true });

  if (!chapter || !notes) return null;

  const handleCopyFormula = (formulaText, index) => {
    navigator.clipboard.writeText(formulaText);
    setCopiedFormulaIndex(index);
    setTimeout(() => setCopiedFormulaIndex(null), 2000);
  };

  const toggleSolution = (idx) => {
    setExpandedSolutions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-fade-in">
      <div
        className={`bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-4xl h-[90vh]'
        }`}
      >
        {/* Header */}
        <div className="px-3 sm:px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                  {chapter.number} • Revision Notes
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> PRO Unlocked
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {chapter.title}
              </h2>
            </div>
          </div>

          {/* User Watermark Tag */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/70 text-[11px] text-slate-300 shrink-0">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate max-w-[140px] font-mono">{user?.email || 'Student Pass'}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Print Notes"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
              title="Close Notes"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Tabs Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-3 sm:px-5 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'formulas'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>Key Formulas</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/40 text-indigo-200">
              {notes.formulas?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('theorems')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'theorems'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>Theorems & Concepts</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/40 text-indigo-200">
              {notes.theorems?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('exemplars')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'exemplars'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>Solved Exemplars</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/40 text-indigo-200">
              {notes.solvedExamples?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pitfalls')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pitfalls'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Exam Traps</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 bg-slate-950/60 text-slate-100">
          
          {/* Chapter Overview Banner */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  {notes.badge}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {notes.readTime}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {notes.summary}
              </p>
            </div>
          </div>

          {/* TAB 1: FORMULAS */}
          {activeTab === 'formulas' && (
            <div className="space-y-3.5">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Formula Cheatsheet & Quick Derivations
              </h3>
              {notes.formulas?.map((f, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/40 rounded-xl p-3.5 sm:p-4 shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      {f.name}
                    </h4>
                    <button
                      onClick={() => handleCopyFormula(f.formula, idx)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 transition active:scale-95 shrink-0 cursor-pointer"
                      title="Copy Formula"
                    >
                      {copiedFormulaIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Formula Code Box */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs sm:text-sm font-bold text-sky-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                    {f.formula}
                  </div>

                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {f.explanation}
                  </p>

                  {f.tip && (
                    <div className="mt-2.5 flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                      <span className="font-bold shrink-0">PRO TIP:</span>
                      <span className="leading-snug">{f.tip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: THEOREMS */}
          {activeTab === 'theorems' && (
            <div className="space-y-3.5">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Official NCERT Theorems & Step-by-Step Proofs
              </h3>
              {notes.theorems?.map((thm, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3.5 sm:p-5 shadow-md space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {thm.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 font-semibold self-start sm:self-auto">
                      {thm.examImportance}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                      Theorem Statement
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed italic">
                      "{thm.statement}"
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Step-by-Step Proof / Algebraic Method
                    </span>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {thm.proofOrMethod}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SOLVED EXEMPLARS */}
          {activeTab === 'exemplars' && (
            <div className="space-y-3.5">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Board Exam Solved Practice Problems
              </h3>
              {notes.solvedExamples?.map((ex, idx) => {
                const isShow = expandedSolutions[idx];
                return (
                  <div
                    key={idx}
                    className="bg-slate-900/90 border border-slate-800/90 rounded-xl overflow-hidden shadow-md"
                  >
                    <div className="p-3.5 sm:p-4 bg-slate-900">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400">
                          Problem {idx + 1}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {ex.boardYear}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                        {ex.problem}
                      </p>
                    </div>

                    <div className="border-t border-slate-800/80 bg-slate-950/70 p-3 sm:px-4 flex items-center justify-between">
                      <button
                        onClick={() => toggleSolution(idx)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                      >
                        {isShow ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        <span>{isShow ? 'Hide Solution' : 'View Step-by-Step Solution'}</span>
                      </button>
                    </div>

                    {isShow && (
                      <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed animate-fade-in">
                        {ex.solution}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: EXAM TRAPS */}
          {activeTab === 'pitfalls' && (
            <div className="space-y-3.5">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Common Mistakes to Avoid in CBSE Board Exam
              </h3>
              {notes.pitfalls?.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3.5 sm:p-4 shadow-md space-y-2.5"
                >
                  <div className="flex items-start gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-rose-400 block mb-0.5">Common Mistake:</span>
                      <span className="leading-snug">{p.mistake}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-400 block mb-0.5">Correct Board Technique:</span>
                      <span className="leading-snug">{p.correction}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
