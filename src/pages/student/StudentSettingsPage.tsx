import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Moon, Sun, Bell, Shield, RotateCcw, Check, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { ThemeSelector } from '../../components/common/ThemeSelector';
import { RoleSwitcher } from '../../components/common/RoleSwitcher';

export const StudentSettingsPage: React.FC = () => {
  const { theme, isDarkMode, toggleDarkMode } = useTheme();
  const { showToast } = useToast();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [anonymousReporting, setAnonymousReporting] = useState(false);

  const handleSavePreferences = () => {
    showToast('Preferences Saved', 'Your system settings have been updated.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in" id="student-settings-page">
      <div>
        <div className="flex items-center gap-2 text-xs text-theme-muted mb-1">
          <Link to="/student/dashboard" className="hover:text-theme-primary">Dashboard</Link>
          <span>/</span>
          <span className="text-theme-primary font-semibold">Settings</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-theme-primary">
          Platform Preferences
        </h1>
        <p className="text-xs text-theme-secondary mt-1">
          Configure appearance, alert notifications, and persona sandbox settings.
        </p>
      </div>

      {/* 1. Appearance & Themes */}
      <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-theme-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-primary" />
          Theme & Interface Appearance
        </h3>
        <p className="text-xs text-theme-secondary">
          Select between multiple curated theme palettes with instant real-time application.
        </p>

        <div className="pt-2">
          <ThemeSelector />
        </div>
      </div>

      {/* 2. Notification Preferences */}
      <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-theme-primary flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-primary" />
          Notification Preferences
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-theme-subtle cursor-pointer hover:bg-surface-hover transition-colors">
            <div>
              <p className="text-xs font-bold text-theme-primary">Email Notifications</p>
              <p className="text-[11px] text-theme-muted">Receive status updates when tickets are classified and resolved</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={e => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-theme-subtle cursor-pointer hover:bg-surface-hover transition-colors">
            <div>
              <p className="text-xs font-bold text-theme-primary">Emergency SMS Alerts</p>
              <p className="text-[11px] text-theme-muted">Send urgent campus water/power outage announcements to mobile</p>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={e => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-theme-subtle cursor-pointer hover:bg-surface-hover transition-colors">
            <div>
              <p className="text-xs font-bold text-theme-primary">Anonymous Public Board Display</p>
              <p className="text-[11px] text-theme-muted">Hide your name when your reported issues appear on campus public feed</p>
            </div>
            <input
              type="checkbox"
              checked={anonymousReporting}
              onChange={e => setAnonymousReporting(e.target.checked)}
              className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary"
            />
          </label>
        </div>

        <button
          onClick={handleSavePreferences}
          className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover shadow-sm"
        >
          Save Preferences
        </button>
      </div>

      {/* 3. Demo Persona Switcher */}
      <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-theme-primary flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-primary" />
          Demo Role Persona Switcher
        </h3>
        <p className="text-xs text-theme-secondary">
          Instantly switch between Student, Faculty, Staff, and Admin roles to preview all dashboard workflows.
        </p>

        <div className="pt-2">
          <RoleSwitcher />
        </div>
      </div>
    </div>
  );
};
