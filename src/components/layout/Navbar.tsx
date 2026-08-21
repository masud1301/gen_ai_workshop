import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bell,
  Menu,
  X,
  PlusCircle,
  LogOut,
  User,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { RoleSwitcher } from '../common/RoleSwitcher';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar, isMobileSidebarOpen }) => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { unreadNotificationCount } = useComplaints();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-theme-subtle bg-surface/90 backdrop-blur-md transition-colors">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated && onToggleMobileSidebar && (
              <button
                id="mobile-sidebar-toggle"
                onClick={onToggleMobileSidebar}
                className="lg:hidden p-2 rounded-lg text-theme-muted hover:text-theme-primary hover:bg-surface-hover transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-tight text-theme-primary">
                    SMARTFIX
                  </span>
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-brand-primary text-white">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-theme-muted -mt-0.5 font-medium hidden sm:inline">
                  Campus Resolution Engine
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Notifications, Role & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            {/* Quick Report Issue Button (for students) */}
            {isAuthenticated && currentUser.role === 'student' && (
              <Link
                to="/student/report"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white transition-colors shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report Issue</span>
              </Link>
            )}

            {/* Notifications */}
            {isAuthenticated && (
              <Link
                to="/student/notifications"
                className="relative p-2 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-surface-hover transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-surface" />
                )}
              </Link>
            )}

            {/* Role Switcher Pill */}
            {isAuthenticated && <RoleSwitcher />}

            {/* Profile Dropdown / Login Link */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-hover transition-colors"
                  aria-label="User menu"
                >
                  <img
                    src={currentUser.avatarUrl || currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-theme-subtle"
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-theme-subtle bg-surface shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-theme-subtle">
                      <p className="text-xs font-bold text-theme-primary truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-theme-muted truncate">{currentUser.email}</p>
                      <div className="mt-1">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary">
                          {currentUser.role}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/student/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-theme-secondary hover:text-theme-primary hover:bg-surface-hover rounded-lg transition-colors"
                      >
                        <User className="w-3.5 h-3.5" />
                        My Profile
                      </Link>
                      <Link
                        to="/student/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-theme-secondary hover:text-theme-primary hover:bg-surface-hover rounded-lg transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Settings & Appearance
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-theme-subtle">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-theme-secondary hover:text-theme-primary hover:bg-surface-hover transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-primary hover:bg-brand-primary-hover text-white transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
