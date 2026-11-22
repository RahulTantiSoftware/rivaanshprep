import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  FileText,
  Sparkles,
  Lock,
  ChevronRight,
  GraduationCap,
  Calculator,
  Compass,
  PieChart,
  Shapes,
  ShieldCheck,
  Award
} from 'lucide-react';

const CHAPTERS = [
  { id: 1, number: 'Ch 01', title: 'Real Numbers', pages: 12, ready: true, icon: Calculator },
  { id: 2, number: 'Ch 02', title: 'Polynomials', pages: 14, ready: true, icon: Shapes },
  { id: 3, number: 'Ch 03', title: 'Linear Equations in 2 Variables', pages: 18, ready: true, icon: FileText },
  { id: 4, number: 'Ch 04', title: 'Quadratic Equations', pages: 16, ready: true, icon: Calculator },
  { id: 5, number: 'Ch 05', title: 'Arithmetic Progressions', pages: 15, ready: true, icon: Shapes },
  { id: 6, number: 'Ch 06', title: 'Triangles', pages: 22, ready: true, icon: Shapes },
  { id: 7, number: 'Ch 07', title: 'Coordinate Geometry', pages: 14, ready: true, icon: Compass },
  { id: 8, number: 'Ch 08', title: 'Introduction to Trigonometry', pages: 24, ready: true, featured: true, icon: Compass },
  { id: 9, number: 'Ch 09', title: 'Applications of Trigonometry', pages: 12, ready: true, icon: Compass },
  { id: 10, number: 'Ch 10', title: 'Circles', pages: 16, ready: true, icon: Shapes },
  { id: 11, number: 'Ch 11', title: 'Areas Related to Circles', pages: 13, ready: true, icon: PieChart },
  { id: 12, number: 'Ch 12', title: 'Surface Areas & Volumes', pages: 20, ready: true, icon: Shapes },
  { id: 13, number: 'Ch 13', title: 'Statistics', pages: 19, ready: true, icon: PieChart },
  { id: 14, number: 'Ch 14', title: 'Probability', pages: 10, ready: true, icon: PieChart },
];

export default function DashboardPage({ setCurrentView }) {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 pb-28 md:pb-16 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src="/logo.png"
              alt="RivaanshPrep"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shadow-xl shadow-indigo-500/30 ring-2 ring-indigo-500/40 shrink-0 mt-1"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Target: Class 10 Board Excellence</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, <span className="text-indigo-400">{user?.fullName || 'Student'}</span>! 📚
              </h1>

              <p className="mt-2 text-sm text-slate-300 max-w-xl">
                Access your handwritten Class 10 Math concept notes, formula cheat-sheets, and verified problem sets tailored for {user?.targetBoard || 'CBSE Class 10'}.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setCurrentView('profile')}
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Manage Security</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
          <div>
            <div className="text-2xl font-extrabold text-white">14</div>
            <div className="text-xs text-slate-400">NCERT Chapters</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-indigo-400">220+</div>
            <div className="text-xs text-slate-400">PDF Note Pages</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-400">100%</div>
            <div className="text-xs text-slate-400">DRM Security</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-400">{user?.targetBoard ? user.targetBoard.split(' ')[0] : 'CBSE'}</div>
            <div className="text-xs text-slate-400">Board Syllabus</div>
          </div>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Class 10th NCERT Study Library
          </h2>
          <p className="text-xs text-slate-400">
            Handwritten high-resolution summaries and formula breakdown
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CHAPTERS.map((ch) => {
          const Icon = ch.icon;
          return (
            <div
              key={ch.id}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                ch.featured
                  ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-950/40'
                  : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-indigo-600/30 flex items-center justify-center text-indigo-400 transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    {ch.number}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base mb-1 group-hover:text-indigo-300 transition">
                  {ch.title}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {ch.pages} Pages • Concept Notes & Formulas
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                {ch.featured ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Featured Pack
                  </span>
                ) : (
                  <span className="text-slate-400">Ready in Phase 2</span>
                )}
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-indigo-600 transition">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
