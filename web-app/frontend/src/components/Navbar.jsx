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
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer shrink-0"
          onClick={() => setCurrentView('ncert-toc')}
        >
          <div className="relative shrink-0">
            <img
              src="/logo.png"
              alt="RivaanshPrep"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-lg shadow-sky-500/25 ring-2 ring-sky-500/40"
            />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-base sm:text-xl tracking-tight text-white leading-none">
              Rivaansh<span className="text-sky-400">Prep</span>
            </div>
            <div className="flex items-center text-[10px] sm:text-xs text-sky-400 font-medium space-x-1 sm:space-x-1.5 mt-0.5 whitespace-nowrap">
              <span>Class 10 • 11 • 12 NCERT</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-emerald-400 hidden sm:inline-flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 inline shrink-0" /> Secure
              </span>
            </div>
          </div>
        </div>

        {/* Navigation / Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          
          {/* Desktop Only: NCERT Books button (Mobile uses fixed bottom navigation bar) */}
          <button
            onClick={() => setCurrentView('ncert-toc')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition active:scale-95 cursor-pointer ${
              currentView === 'ncert-toc'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/30'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>NCERT Books</span>
          </button>

          {user ? (
            <>
              {/* Admin Button: compact shield on mobile, full button on desktop */}
              {user.role === 'ROLE_ADMIN' && (
                <button
                  onClick={() => setCurrentView('admin-users')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition active:scale-95 cursor-pointer ${
                    currentView === 'admin-users'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
                  }`}
                  title="Admin User Management"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline">User Management</span>
                  <span className="sm:hidden text-[10px] font-mono uppercase font-bold text-amber-300">Admin</span>
                </button>
              )}

              {/* Dashboard: desktop only */}
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

              {/* Profile Avatar */}
              <button
                onClick={() => setCurrentView('profile')}
                className={`flex items-center space-x-1.5 sm:space-x-2 p-1 sm:px-3 sm:py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title={user.fullName || 'User Profile'}
              >
                <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
                  {user.fullName ? user.fullName.charAt(0) : 'S'}
                </div>
                <span className="hidden md:inline max-w-[120px] truncate">{user.fullName}</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-slate-400 hover:text-rose-400 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-sm font-medium hover:bg-rose-500/10 transition cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline text-xs">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <button
                onClick={() => setCurrentView('login')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  currentView === 'login'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 border border-indigo-500/30'
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
