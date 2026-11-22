import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import {
  User,
  Shield,
  Smartphone,
  CreditCard,
  Lock,
  Phone,
  GraduationCap,
  Mail,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  Laptop,
  Check
} from 'lucide-react';

export default function ProfilePage({ setCurrentView }) {
  const { user, updateProfile, changePassword, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('personal'); // personal, security, sessions, subscription
  
  // Personal Info form
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    targetBoard: user?.targetBoard || 'CBSE Class 10',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Sessions state
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Status banners
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        targetBoard: user.targetBoard || 'CBSE Class 10',
      });
    }
  }, [user]);

  // Load sessions when switching to sessions tab
  useEffect(() => {
    if (activeTab === 'sessions') {
      fetchSessions();
    }
  }, [activeTab]);

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const response = await axiosClient.get('/profile/sessions');
      setSessions(response.data);
    } catch {
      // Handled silently
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      await updateProfile(profileForm);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setMessage('Password changed successfully! Keep your new credentials safe.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeOthers = async () => {
    setError('');
    setMessage('');
    setSaving(true);
    try {
      await axiosClient.post('/profile/sessions/revoke-others');
      setMessage('All other devices have been logged out.');
      fetchSessions();
    } catch (err) {
      setError('Could not revoke sessions.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 pb-24 md:pb-12 pt-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Mobile-Friendly Profile Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-1 shadow-xl flex items-center justify-center text-3xl font-extrabold text-white uppercase select-none">
            {user?.fullName ? user.fullName.charAt(0) : 'S'}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {user?.fullName || 'Student'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {user?.role === 'ROLE_ADMIN' ? 'Admin' : 'Class 10 Student'}
              </span>
            </div>

            <p className="text-sm text-slate-400 mb-3">{user?.email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>{user?.targetBoard || 'CBSE Class 10'}</span>
              </span>

              <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5" />
                <span>Protected Account</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              setCurrentView('login');
            }}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition active:scale-95 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-300 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-rose-300 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Mobile-First Segmented Tab Pills */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl mb-6 select-none">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer ${
            activeTab === 'personal'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Info</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Password</span>
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer ${
            activeTab === 'sessions'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Active Devices</span>
        </button>

        <button
          onClick={() => setActiveTab('subscription')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer ${
            activeTab === 'subscription'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Subscription</span>
        </button>
      </div>

      {/* Tab 1: Personal Info */}
      {activeTab === 'personal' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-1">Student Profile Details</h2>
          <p className="text-xs text-slate-400 mb-6">
            Keep your board and contact info updated for personalized math problem sets.
          </p>

          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address (Primary Login)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/40 border border-slate-800 rounded-xl text-slate-400 text-sm cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Email is verified and linked to your math subscription.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                  Target Board
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <select
                    value={profileForm.targetBoard}
                    onChange={(e) => setProfileForm({ ...profileForm, targetBoard: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={profileForm.phoneNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-1">Account Password & Security</h2>
          <p className="text-xs text-slate-400 mb-6">
            Ensure your account is protected with a strong, complex passphrase.
          </p>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">Must be at least 8 chars with uppercase, lowercase, digit & symbol.</span>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Active Devices & Sessions */}
      {activeTab === 'sessions' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Active Login Sessions</h2>
              <p className="text-xs text-slate-400">
                Devices currently logged into your RivaanshPrep student account.
              </p>
            </div>

            <button
              onClick={handleRevokeOthers}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition active:scale-95 cursor-pointer"
            >
              Log Out All Other Devices
            </button>
          </div>

          {loadingSessions ? (
            <div className="py-8 text-center text-slate-400 text-sm">Loading sessions...</div>
          ) : (
            <div className="space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                    sess.current
                      ? 'bg-indigo-950/20 border-indigo-500/40'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl ${sess.current ? 'bg-indigo-600/30 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {sess.userAgent ? sess.userAgent.split(' ')[0] : 'Browser Client'}
                        </span>
                        {sess.current && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            This Device
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        IP: {sess.ipAddress || '127.0.0.1'} • Started: {new Date(sess.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Subscription & Notes (Phase 2 Preview) */}
      {activeTab === 'subscription' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Phase 2 Store Ready
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Class 10th Math Subscription Pass</h2>
          <p className="text-sm text-slate-400 mb-6">
            Your profile is ready to connect with the secure PDF note viewer, multi-language chapter notes, and subscription checkout.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Tier</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-2">Free Starter Access</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Browse Chapter 8 Trigonometry intro notes and sample interactive summaries.
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Active Free Student
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-950 border border-indigo-500/40 flex flex-col justify-between relative overflow-hidden">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Coming in Phase 2</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-2">All-Chapter Math Pass</h3>
                <p className="text-xs text-slate-300 mb-4">
                  Access all 15 Class 10 NCERT Chapters, formula cheatsheets, and DRM-watermarked PDF downloads.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition active:scale-95 cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                Browse Math Chapters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
