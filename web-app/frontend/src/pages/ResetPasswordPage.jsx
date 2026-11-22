import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Lock, KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function ResetPasswordPage({ setCurrentView, defaultToken = '' }) {
  const [token, setToken] = useState(defaultToken);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Password checks
  const hasLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasDigit = /\d/.test(newPassword);
  const hasSpecial = /[@$!%*?&#^()_+\-={}\[\]:;"'<>,.?/|~`]/.test(newPassword);
  const isValid = hasLength && hasUpper && hasLower && hasDigit && hasSpecial;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!isValid) {
      setError('Password must meet all complexity requirements.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/reset-password', {
        token: token.trim(),
        newPassword,
      });
      setMessage(response.data.message || 'Password updated successfully!');
      setTimeout(() => {
        setCurrentView('login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="RivaanshPrep Logo"
              className="w-14 h-14 rounded-full object-cover shadow-xl shadow-sky-500/25 ring-2 ring-sky-500/40"
            />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            Create New Password
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Enter the recovery token and specify your new secure password.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-3 text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />
              <span>{message} Redirecting to sign in...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                Reset Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste UUID token here"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Requirement ticks */}
              <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] text-slate-400">
                <span className={hasLength ? 'text-emerald-400' : ''}>• 8+ Characters</span>
                <span className={hasUpper ? 'text-emerald-400' : ''}>• Uppercase</span>
                <span className={hasLower ? 'text-emerald-400' : ''}>• Lowercase</span>
                <span className={hasDigit && hasSpecial ? 'text-emerald-400' : ''}>• Digit & Symbol</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isValid}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
