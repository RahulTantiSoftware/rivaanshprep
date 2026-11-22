import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, LogOut, ShieldCheck, BookText } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setCurrentView('login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center space-x-3 cursor-pointer select-none"
          onClick={() => setCurrentView('ncert-toc')}
        >
          <div className="relative shrink-0">
            <img
              src="/logo.png"
              alt="RivaanshPrep"
              className="w-10 h-10 rounded-full object-cover shadow-lg shadow-sky-500/25 ring-2 ring-sky-500/40"
            />
          </div>
          <div>
            <div className="font-extrabold text-lg sm:text-xl tracking-tight text-white leading-tight">
              Rivaansh<span className="text-sky-400">Prep</span>
            </div>
            <div className="flex items-center text-[11px] sm:text-xs text-sky-400 font-medium space-x-1.5 mt-0.5 whitespace-nowrap">
              <span>Class 10th NCERT</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 inline shrink-0" /> Secure
              </span>
            </div>
          </div>
        </div>

        {/* Navigation / Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* NCERT Contents Button (Desktop/Tablet; Mobile uses Bottom Navigation Bar) */}
          <button
            onClick={() => setCurrentView('ncert-toc')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition active:scale-95 cursor-pointer ${
              currentView === 'ncert-toc'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/30'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>10th Subjects</span>
          </button>

          {user ? (
            <>
              {user.role === 'ROLE_ADMIN' && (
                <button
                  onClick={() => setCurrentView('admin-users')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition active:scale-95 cursor-pointer ${
                    currentView === 'admin-users'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>User Management</span>
                </button>
              )}

              <button
                onClick={() => setCurrentView('dashboard')}
                className={`hidden md:inline-flex px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => setCurrentView('profile')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {user.fullName ? user.fullName.charAt(0) : 'S'}
                </div>
                <span className="hidden sm:inline">{user.fullName}</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-lg text-sm font-medium hover:bg-rose-500/10 transition cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentView('login')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
                  currentView === 'login'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentView('register')}
                className={`hidden sm:inline-flex px-4 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  currentView === 'register'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30'
                }`}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
