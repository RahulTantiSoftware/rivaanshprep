import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Phone, GraduationCap, Eye, EyeOff, CheckCircle2, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage({ setCurrentView }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    targetBoard: 'CBSE Class 10',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password strength checks
  const password = formData.password;
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[@$!%*?&#^()_+\-={}\[\]:;"'<>,.?/|~`]/.test(password);

  const passedCount = [hasLength, hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;
  const isPasswordValid = passedCount === 5;

  const getStrengthLabel = () => {
    if (!password) return { text: '', color: 'bg-slate-700' };
    if (passedCount <= 2) return { text: 'Weak', color: 'bg-rose-500' };
    if (passedCount <= 4) return { text: 'Fair', color: 'bg-amber-500' };
    return { text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getStrengthLabel();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Please satisfy all password security requirements before proceeding.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => {
        setCurrentView('login');
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <img
              src="/logo.png"
              alt="RivaanshPrep Logo"
              className="w-16 h-16 rounded-full object-cover shadow-xl shadow-indigo-500/25 ring-2 ring-indigo-500/40"
            />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Join <span className="text-indigo-400">RivaanshPrep</span>
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Create your Class 10 Math student account
          </p>
        </div>

        <div className="mt-8">
          <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-300 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-300 text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <span>Registration successful! Redirecting to sign in...</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Rohan Sharma"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="e.g. rohan10"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs sm:text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rohan@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              {/* Target Board & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
                    Target Board
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <select
                      value={formData.targetBoard}
                      onChange={(e) => setFormData({ ...formData, targetBoard: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
                    >
                      <option value="CBSE Class 10">CBSE Class 10</option>
                      <option value="ICSE Class 10">ICSE Class 10</option>
                      <option value="UP Board Class 10">UP Board Class 10</option>
                      <option value="Bihar Board Class 10">Bihar Board Class 10</option>
                      <option value="State Board Class 10">Other State Board</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
                  Secure Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-2.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Security Strength:</span>
                      <span className={`font-semibold ${strength.text === 'Strong' ? 'text-emerald-400' : strength.text === 'Fair' ? 'text-amber-400' : 'text-rose-400'}`}>
                        {strength.text}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${(passedCount / 5) * 100}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                      <div className={`flex items-center gap-1 ${hasLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {hasLength ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>8+ Characters</span>
                      </div>
                      <div className={`flex items-center gap-1 ${hasUpper ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {hasUpper ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>Uppercase Letter</span>
                      </div>
                      <div className={`flex items-center gap-1 ${hasLower ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {hasLower ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>Lowercase Letter</span>
                      </div>
                      <div className={`flex items-center gap-1 ${hasDigit && hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {hasDigit && hasSpecial ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>Number & Special Symbol</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading || !isPasswordValid}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/30 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-400">
                Already registered?{' '}
                <button
                  onClick={() => setCurrentView('login')}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 transition"
                >
                  Sign in instead
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
