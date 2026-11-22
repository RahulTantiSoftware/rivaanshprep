import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Search,
  RefreshCw,
  Crown,
  KeyRound,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserX,
  UserCheck,
  CreditCard,
  Mail,
  Calendar,
  Lock,
  X,
  Filter,
  Check,
  Clock,
  Sparkles
} from 'lucide-react';

const API_BASE = '/admin';

export default function AdminUserManagementPage({ setCurrentView }) {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // ALL, ACTIVE, SUSPENDED, PREMIUM, ADMIN
  const [toast, setToast] = useState(null);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(null); // user obj
  const [showSubModal, setShowSubModal] = useState(null); // user obj
  const [showDeleteModal, setShowDeleteModal] = useState(null); // user obj

  // Form States
  const [addForm, setAddForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'ROLE_STUDENT',
    subscriptionPlan: 'FREE',
    subscriptionStatus: 'INACTIVE',
    targetBoard: 'CBSE Class 10',
    emailVerified: true
  });
  const [newPassword, setNewPassword] = useState('');
  const [subForm, setSubForm] = useState({
    subscriptionPlan: 'PREMIUM',
    subscriptionStatus: 'ACTIVE'
  });
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch users & stats
  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [statsRes, usersRes] = await Promise.all([
        axiosClient.get(`${API_BASE}/stats`),
        axiosClient.get(`${API_BASE}/users`)
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showToast(err.response?.data?.message || 'Failed to fetch user directory', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter & Search logic
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Filter tab
    if (selectedFilter === 'ACTIVE') {
      result = result.filter(u => u.active);
    } else if (selectedFilter === 'SUSPENDED') {
      result = result.filter(u => !u.active);
    } else if (selectedFilter === 'PREMIUM') {
      result = result.filter(u => u.subscriptionPlan === 'PREMIUM' || u.subscriptionPlan === 'PRO');
    } else if (selectedFilter === 'ADMIN') {
      result = result.filter(u => u.role === 'ROLE_ADMIN');
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        u =>
          u.fullName?.toLowerCase().includes(q) ||
          u.username?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [users, selectedFilter, searchQuery]);

  // Toggle user active status
  const handleToggleStatus = async (user) => {
    if (user.id === currentAdmin?.id) {
      showToast('You cannot suspend your own admin account.', 'error');
      return;
    }

    const newStatus = !user.active;
    try {
      await axiosClient.put(
        `${API_BASE}/users/${user.id}/status`,
        { active: newStatus }
      );
      showToast(`User @${user.username} is now ${newStatus ? 'ACTIVE' : 'SUSPENDED'}`);
      fetchData(true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  // Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await axiosClient.post(`${API_BASE}/users`, addForm);
      showToast(`User @${addForm.username} created successfully!`);
      setShowAddModal(false);
      setAddForm({
        fullName: '',
        username: '',
        email: '',
        password: '',
        role: 'ROLE_STUDENT',
        subscriptionPlan: 'FREE',
        subscriptionStatus: 'INACTIVE',
        targetBoard: 'CBSE Class 10',
        emailVerified: true
      });
      fetchData(true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      showToast('Password must be at least 8 characters long', 'error');
      return;
    }
    setActionLoading(true);
    try {
      await axiosClient.put(
        `${API_BASE}/users/${showResetModal.id}/reset-password`,
        { newPassword }
      );
      showToast(`Password for @${showResetModal.username} updated!`);
      setShowResetModal(null);
      setNewPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reset password', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Update Subscription
  const handleUpdateSubscription = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await axiosClient.put(
        `${API_BASE}/users/${showSubModal.id}/subscription`,
        subForm
      );
      showToast(`Subscription for @${showSubModal.username} updated!`);
      setShowSubModal(null);
      fetchData(true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update subscription', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    if (!showDeleteModal) return;
    if (showDeleteModal.id === currentAdmin?.id) {
      showToast('You cannot delete your own admin account.', 'error');
      setShowDeleteModal(null);
      return;
    }
    setActionLoading(true);
    try {
      await axiosClient.delete(`${API_BASE}/users/${showDeleteModal.id}`);
      showToast(`User @${showDeleteModal.username} deleted permanently`);
      setShowDeleteModal(null);
      fetchData(true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-200">
          {toast.type === 'error' ? (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className={toast.type === 'error' ? 'text-rose-200' : 'text-emerald-200'}>
            {toast.message}
          </span>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 shadow-lg shadow-sky-500/10">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  User Management
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-mono font-bold tracking-wider uppercase">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage accounts, student roles, subscriptions & security credentials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing || loading}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Refresh User Directory"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-sky-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-sky-600/25 transition active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Stat Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                Total Users
              </div>
              <div className="text-2xl font-black text-white mt-0.5">
                {stats ? stats.totalUsers : '—'}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                Active Accounts
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">
                {stats ? stats.activeUsers : '—'}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                Premium Subscriptions
              </div>
              <div className="text-2xl font-black text-amber-400 mt-0.5">
                {stats ? stats.subscribedUsers : '—'}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                Administrators
              </div>
              <div className="text-2xl font-black text-sky-400 mt-0.5">
                {stats ? stats.adminUsers : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-3 sm:p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'ALL', label: 'All Users', count: users.length },
              { id: 'ACTIVE', label: 'Active', count: users.filter(u => u.active).length },
              { id: 'SUSPENDED', label: 'Suspended', count: users.filter(u => !u.active).length },
              { id: 'PREMIUM', label: 'Pro & Premium', count: users.filter(u => u.subscriptionPlan === 'PREMIUM' || u.subscriptionPlan === 'PRO').length },
              { id: 'ADMIN', label: 'Admins', count: users.filter(u => u.role === 'ROLE_ADMIN').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  selectedFilter === tab.id
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedFilter === tab.id ? 'bg-sky-700/60 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, @user..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <div className="w-8 h-8 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-3" />
              <p className="text-xs font-medium">Loading user database...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No users match your criteria</p>
              <p className="text-xs text-slate-500 mt-0.5">Try clearing your filters or search terms</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Subscription</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 hidden md:table-cell">Last Login</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((u) => {
                    const isSelf = u.id === currentAdmin?.id;
                    const initial = u.fullName ? u.fullName.charAt(0).toUpperCase() : 'U';

                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-800/30 transition-colors group"
                      >
                        {/* User Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-9 sm:py-9 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0">
                              {initial}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-white truncate flex items-center gap-1.5">
                                <span>{u.fullName}</span>
                                {isSelf && (
                                  <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 text-[10px] font-mono font-bold">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                                <span className="text-sky-400/90">@{u.username}</span>
                                <span className="text-slate-600">•</span>
                                <span className="truncate max-w-[150px] sm:max-w-none text-slate-400">
                                  {u.email}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {u.role === 'ROLE_ADMIN' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold text-[11px]">
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium text-[11px]">
                              Student
                            </span>
                          )}
                        </td>

                        {/* Subscription */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setShowSubModal(u);
                              setSubForm({
                                subscriptionPlan: u.subscriptionPlan || 'FREE',
                                subscriptionStatus: u.subscriptionStatus || 'INACTIVE'
                              });
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition active:scale-95 cursor-pointer hover:opacity-90"
                            style={{
                              backgroundColor:
                                u.subscriptionPlan === 'PREMIUM'
                                  ? 'rgba(245, 158, 11, 0.1)'
                                  : u.subscriptionPlan === 'PRO'
                                  ? 'rgba(14, 165, 233, 0.1)'
                                  : 'rgba(51, 65, 85, 0.4)',
                              borderColor:
                                u.subscriptionPlan === 'PREMIUM'
                                  ? 'rgba(245, 158, 11, 0.3)'
                                  : u.subscriptionPlan === 'PRO'
                                  ? 'rgba(14, 165, 233, 0.3)'
                                  : 'rgba(71, 85, 105, 0.4)',
                              color:
                                u.subscriptionPlan === 'PREMIUM'
                                  ? '#fbbf24'
                                  : u.subscriptionPlan === 'PRO'
                                  ? '#38bdf8'
                                  : '#94a3b8'
                            }}
                            title="Click to modify plan"
                          >
                            <Crown className="w-3 h-3" />
                            <span>{u.subscriptionPlan || 'FREE'}</span>
                            <span className="text-[9px] uppercase px-1 rounded bg-black/30 font-mono">
                              {u.subscriptionStatus === 'ACTIVE' ? 'Active' : 'Off'}
                            </span>
                          </button>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={isSelf}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition active:scale-95 ${
                              isSelf ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                            } ${
                              u.active
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                            }`}
                            title={isSelf ? 'Cannot suspend self' : 'Toggle Active/Suspended status'}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.active ? 'bg-emerald-400' : 'bg-rose-400'
                              }`}
                            />
                            <span>{u.active ? 'Active' : 'Suspended'}</span>
                          </button>
                        </td>

                        {/* Last Login */}
                        <td className="py-3.5 px-4 hidden md:table-cell whitespace-nowrap text-xs text-slate-400 font-mono">
                          {u.lastLoginAt ? (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {new Date(u.lastLoginAt).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          ) : (
                            <span className="text-slate-600">Never</span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                            {/* Password Reset */}
                            <button
                              onClick={() => {
                                setShowResetModal(u);
                                setNewPassword('');
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-sky-300 transition active:scale-95 cursor-pointer"
                              title="Reset Password"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete User */}
                            <button
                              onClick={() => setShowDeleteModal(u)}
                              disabled={isSelf}
                              className={`p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 transition active:scale-95 ${
                                isSelf ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                              title={isSelf ? 'Cannot delete self' : 'Delete user account'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL: ADD USER ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Create New User</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.fullName}
                    onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                    placeholder="e.g. Rohan Verma"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.username}
                    onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                    placeholder="e.g. rohan10"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    placeholder="rohan@example.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Initial Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    placeholder="Min 8 characters"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    User Role
                  </label>
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="ROLE_STUDENT">Student (ROLE_STUDENT)</option>
                    <option value="ROLE_ADMIN">Administrator (ROLE_ADMIN)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Subscription Plan
                  </label>
                  <select
                    value={addForm.subscriptionPlan}
                    onChange={(e) => setAddForm({ ...addForm, subscriptionPlan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="FREE">Free Tier</option>
                    <option value="PRO">Pro Tier</option>
                    <option value="PREMIUM">Premium VIP Tier</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: RESET PASSWORD ================= */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Reset User Password</h3>
              </div>
              <button
                onClick={() => setShowResetModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="text-slate-400">Target User:</div>
                <div className="font-semibold text-white mt-0.5">
                  {showResetModal.fullName}{' '}
                  <span className="text-sky-400 font-mono">(@{showResetModal.username})</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPassword('Rivaansh@' + Math.floor(1000 + Math.random() * 9000))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-sky-600/30 hover:bg-sky-600 text-sky-300 hover:text-white text-[10px] font-mono font-semibold transition"
                  >
                    Generate
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Minimum 8 characters required.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowResetModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SUBSCRIPTION ================= */}
      {showSubModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Crown className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Modify Subscription</h3>
              </div>
              <button
                onClick={() => setShowSubModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubscription} className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="text-slate-400">Target User:</div>
                <div className="font-semibold text-white mt-0.5">
                  {showSubModal.fullName}{' '}
                  <span className="text-sky-400 font-mono">(@{showSubModal.username})</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Plan Tier
                </label>
                <select
                  value={subForm.subscriptionPlan}
                  onChange={(e) => setSubForm({ ...subForm, subscriptionPlan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="FREE">Free Tier</option>
                  <option value="PRO">Pro Tier</option>
                  <option value="PREMIUM">Premium VIP Tier</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Subscription Status
                </label>
                <select
                  value={subForm.subscriptionStatus}
                  onChange={(e) => setSubForm({ ...subForm, subscriptionStatus: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="ACTIVE">ACTIVE (Access Granted)</option>
                  <option value="INACTIVE">INACTIVE (No Access)</option>
                  <option value="EXPIRED">EXPIRED</option>
                  <option value="TRIAL">TRIAL</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSubModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Delete Account Permanently?</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Are you sure you want to delete user{' '}
                <strong className="text-white">@{showDeleteModal.username}</strong> ({showDeleteModal.fullName})?
                This action is immediate and cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/25 disabled:opacity-50"
                >
                  {actionLoading ? 'Deleting...' : 'Yes, Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
