import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, GraduationCap, School, Wrench, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, switchRole } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter an email', undefined, 'error');
      return;
    }

    setIsLoading(true);
    const res = await login(email, password || 'password123');
    setIsLoading(false);

    if (res.success && res.user) {
      showToast('Logged in successfully', `Welcome back, ${res.user.name}`, 'success');
      const target =
        res.user.role === 'admin'
          ? '/admin/dashboard'
          : res.user.role === 'staff'
          ? '/staff/dashboard'
          : res.user.role === 'faculty'
          ? '/faculty/dashboard'
          : '/student/dashboard';
      navigate(target);
    } else {
      showToast('Authentication failed', res.error || 'Invalid email or credentials.', 'error');
    }
  };

  const handleDemoLogin = (role: UserRole, targetRoute: string) => {
    switchRole(role);
    showToast(`Signed in as Demo ${role.toUpperCase()}`, 'Loaded with persistent demo campus records', 'info');
    navigate(targetRoute);
  };

  return (
    <div className="min-h-screen flex flex-col bg-app text-theme-primary transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white mx-auto mb-4 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-theme-primary">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-theme-secondary mt-1">
              Sign in to manage and track campus resolution tickets
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-theme-subtle bg-surface p-6 sm:p-8 shadow-xl">
            {/* Standard Email/Pass Form */}
            <form onSubmit={handleStandardLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1.5">
                  Campus Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-theme-secondary">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-brand-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-theme-subtle" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-surface px-3 text-theme-muted">
                  Instant Demo Sandbox Access
                </span>
              </div>
            </div>

            {/* 1-Click Demo Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleDemoLogin('student', '/student/dashboard')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-theme-subtle bg-surface-elevated hover:bg-surface-hover hover:border-theme-strong transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-theme-primary">Continue as Demo Student</p>
                    <p className="text-[11px] text-theme-muted">Alex Rivera (Hostel Block C, Room 312)</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-theme-muted group-hover:text-brand-primary transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => handleDemoLogin('staff', '/staff/dashboard')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-theme-subtle bg-surface-elevated hover:bg-surface-hover hover:border-theme-strong transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-theme-primary">Continue as Demo Staff</p>
                    <p className="text-[11px] text-theme-muted">Marcus Jenkins (IT Infrastructure)</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-theme-muted group-hover:text-brand-primary transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => handleDemoLogin('admin', '/admin/dashboard')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-theme-subtle bg-surface-elevated hover:bg-surface-hover hover:border-theme-strong transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-theme-primary">Continue as Demo Admin</p>
                    <p className="text-[11px] text-theme-muted">Dean Arthur Patel (Executive Ops)</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-theme-muted group-hover:text-brand-primary transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => handleDemoLogin('faculty', '/faculty/dashboard')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-theme-subtle bg-surface-elevated hover:bg-surface-hover hover:border-theme-strong transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <School className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-theme-primary">Continue as Demo Faculty</p>
                    <p className="text-[11px] text-theme-muted">Dr. Evelyn Vance (Dept of Electrical Eng)</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-theme-muted group-hover:text-brand-primary transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Footer Sign Up link */}
            <div className="mt-6 pt-4 border-t border-theme-subtle text-center text-xs text-theme-secondary">
              Don't have a campus account?{' '}
              <Link to="/register" className="text-brand-primary font-bold hover:underline">
                Register Student / Faculty ID
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
