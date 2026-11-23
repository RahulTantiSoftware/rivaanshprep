import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNavBar from './components/BottomNavBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import NcertBookView from './pages/NcertBookView';
import AdminUserManagementPage from './pages/AdminUserManagementPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('ncert-toc');
  const [resetToken, setResetToken] = useState('');

  // Handle URL tokens on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setResetToken(token);
      setCurrentView('reset-password');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-3 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Loading NCERT Platform...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-600 selection:text-white">
      {/* Top App Bar */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'ncert-toc' && <NcertBookView />}
        {currentView === 'login' && <LoginPage setCurrentView={setCurrentView} />}
        {currentView === 'register' && <RegisterPage setCurrentView={setCurrentView} />}
        {currentView === 'forgot-password' && (
          <ForgotPasswordPage setCurrentView={setCurrentView} setResetToken={setResetToken} />
        )}
        {currentView === 'reset-password' && (
          <ResetPasswordPage setCurrentView={setCurrentView} defaultToken={resetToken} />
        )}
        {currentView === 'dashboard' && user && <DashboardPage setCurrentView={setCurrentView} />}
        {currentView === 'profile' && user && <ProfilePage setCurrentView={setCurrentView} />}
        {currentView === 'admin-users' && user?.role === 'ROLE_ADMIN' && (
          <AdminUserManagementPage setCurrentView={setCurrentView} />
        )}
      </main>

      {/* Mobile App Bottom Navigation Bar */}
      <BottomNavBar currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
