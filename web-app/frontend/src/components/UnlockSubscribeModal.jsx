import React, { useState } from 'react';
import {
  X,
  Lock,
  Sparkles,
  Check,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Zap,
  Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UnlockSubscribeModal({
  chapter,
  onClose,
  onSuccessUnlock,
  setCurrentView
}) {
  const { user, subscribe } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('full-pass');
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = () => {
    setIsActivating(true);
    setTimeout(() => {
      const planName = selectedPlan === 'full-pass' ? '10th Math Board Pass (₹199)' : 'All-Subjects Master Pass (₹399)';
      subscribe(planName);
      setIsActivating(false);
      onSuccessUnlock();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-start justify-between relative">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
              <Lock className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" /> Paid Feature • Instant Unlock
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Unlock Smart Study Notes
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {chapter ? `Chapter ${chapter.id}: ${chapter.title}` : 'All 14 Class 10 NCERT Chapters'}
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Comparison / Feature Highlights */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Free Tier Card */}
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                Free Forever
              </span>
              <h4 className="text-xs font-bold text-white mt-0.5 mb-2">
                Official NCERT Book
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>All 14 PDF Chapters</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Subtopics & Exercises</span>
                </li>
              </ul>
            </div>

            {/* Paid PRO Card */}
            <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">
                  PRO Unlock
                </span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </div>
              <h4 className="text-xs font-bold text-white mt-0.5 mb-2">
                Interactive Notes
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-200">
                <li className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Formula Cheatsheets</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Solved Exemplars</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Exam Pitfalls & Tips</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pricing Options */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Choose Your Subscription Pass
            </label>

            {/* Plan 1 */}
            <div
              onClick={() => setSelectedPlan('full-pass')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedPlan === 'full-pass'
                  ? 'bg-indigo-950/50 border-indigo-500 shadow-lg shadow-indigo-600/10'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedPlan === 'full-pass'
                    ? 'border-indigo-500 bg-indigo-500'
                    : 'border-slate-600'
                }`}>
                  {selectedPlan === 'full-pass' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-xs sm:text-sm font-bold text-white">
                      10th Mathematics Study Pass
                    </h5>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                      Popular
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Unlock all 14 chapters HTML notes for the full board session
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-white">₹199</span>
                <span className="text-[10px] text-slate-500 line-through block leading-none">₹599</span>
              </div>
            </div>

            {/* Plan 2 */}
            <div
              onClick={() => setSelectedPlan('all-subjects')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedPlan === 'all-subjects'
                  ? 'bg-indigo-950/50 border-indigo-500 shadow-lg shadow-indigo-600/10'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedPlan === 'all-subjects'
                    ? 'border-indigo-500 bg-indigo-500'
                    : 'border-slate-600'
                }`}>
                  {selectedPlan === 'all-subjects' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-xs sm:text-sm font-bold text-white">
                      All 5 Subjects Pro Pass
                    </h5>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase">
                      Best Value
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Math + Science + Social Science + English + Hindi
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-white">₹399</span>
                <span className="text-[10px] text-slate-500 line-through block leading-none">₹999</span>
              </div>
            </div>
          </div>

          {/* User Status Note */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {user ? (
                <>Linked to student account: <strong className="text-slate-200">{user.email || user.username}</strong></>
              ) : (
                <>Instant access activated for current session. You can link anytime in profile.</>
              )}
            </span>
          </div>

          {/* Activate Button */}
          <button
            onClick={handleActivate}
            disabled={isActivating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-indigo-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 transition cursor-pointer disabled:opacity-70"
          >
            {isActivating ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Unlock & Subscribe Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full text-center text-xs text-slate-500 hover:text-slate-400 transition cursor-pointer"
          >
            Continue with Free NCERT Book PDF
          </button>
        </div>
      </div>
    </div>
  );
}
