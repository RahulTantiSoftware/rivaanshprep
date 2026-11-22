import React from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle2,
  Bell,
  ArrowRight
} from 'lucide-react';

export default function SmartNotesComingSoonModal({
  chapter,
  onClose,
  onOpenPdf
}) {
  if (!chapter) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-fade-in select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <img
              src="/logo.png"
              alt="RivaanshPrep"
              className="w-11 h-11 rounded-full object-cover shadow-lg shadow-indigo-500/30 shrink-0 ring-2 ring-indigo-500/40"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                <Clock className="w-3 h-3 text-amber-400" /> Coming Soon
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Smart Notes in Preparation
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {chapter.number}: {chapter.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Curated interactive HTML revision notes, board exam formula cheatsheets, and verified NCERT exemplar solutions for <strong className="text-white">{chapter.title}</strong> are undergoing final editorial review for the 2026-27 Board session.
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
              What's Coming in this Chapter
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>High-Yield Formula Cheatsheet with 1-click copy</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Step-by-step theorem proofs & diagrams</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>CBSE 5-Year Solved Exemplars with marking schemes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Common board exam pitfalls & traps to avoid</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                onClose();
                onOpenPdf();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-600/30 transition active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Official NCERT PDF (Free Now)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-center text-xs text-slate-400 hover:text-slate-300 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
