import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export default function ForgotPasswordPage({ setCurrentView, setResetToken }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axiosClient.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'If an account exists, reset instructions have been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <button
          onClick={() => setCurrentView('login')}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>

        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="RivaanshPrep Logo"
              className="w-14 h-14 rounded-full object-cover shadow-xl shadow-sky-500/25 ring-2 ring-sky-500/40"
            />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            Reset Password
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Enter your registered email address and we'll dispatch a secure recovery link.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {message ? (
            <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                <span>{message}</span>
              </div>
              <p className="text-xs text-slate-400">
                Check your email inbox (or backend terminal output for development token).
              </p>
              <button
                onClick={() => setCurrentView('reset-password')}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
              >
                I have a reset token
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Reset Instructions</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
