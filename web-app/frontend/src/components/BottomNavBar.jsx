import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, BookOpen, User, LogIn, BookText } from 'lucide-react';

export default function BottomNavBar({ currentView, setCurrentView }) {
  const { user } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-4 py-2 flex items-center justify-around pb-safe shadow-2xl">
      {/* NCERT Contents Tab */}
      <button
        onClick={() => setCurrentView('ncert-toc')}
        className={`flex flex-col items-center py-1 px-3 rounded-2xl transition active:scale-90 cursor-pointer ${
          currentView === 'ncert-toc' ? 'text-sky-400 font-bold' : 'text-slate-400'
        }`}
      >
        <BookText className={`w-5 h-5 mb-0.5 ${currentView === 'ncert-toc' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[11px]">Subjects</span>
      </button>

      {/* Dashboard / Home Tab */}
      <button
        onClick={() => setCurrentView(user ? 'dashboard' : 'login')}
        className={`flex flex-col items-center py-1 px-3 rounded-2xl transition active:scale-90 cursor-pointer ${
          currentView === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-400'
        }`}
      >
        <Home className={`w-5 h-5 mb-0.5 ${currentView === 'dashboard' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[11px]">Dashboard</span>
      </button>

      {/* Profile / Auth Tab */}
      {user ? (
        <button
          onClick={() => setCurrentView('profile')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition active:scale-90 cursor-pointer ${
            currentView === 'profile' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <div className="relative">
            <User className={`w-5 h-5 mb-0.5 ${currentView === 'profile' ? 'stroke-[2.5]' : ''}`} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
          </div>
          <span className="text-[11px]">Profile</span>
        </button>
      ) : (
        <button
          onClick={() => setCurrentView('login')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition active:scale-90 cursor-pointer ${
            currentView === 'login' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <LogIn className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Sign In</span>
        </button>
      )}
    </div>
  );
}
