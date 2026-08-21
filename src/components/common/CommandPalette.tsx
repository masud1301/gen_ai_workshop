import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle, FileText, Bell, Sparkles, User, Settings, Building2, HelpCircle, ArrowRight } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { complaints } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown handler for Cmd+K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Trigger toggle if not open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { label: 'Report a New Campus Issue', icon: PlusCircle, route: '/student/report', role: 'all' },
    { label: 'View All Campus Complaints', icon: FileText, route: '/student/complaints', role: 'all' },
    { label: 'Lost & Found Bulletin', icon: HelpCircle, route: '/student/lost-found', role: 'student' },
    { label: 'Notifications & Alerts', icon: Bell, route: '/student/notifications', role: 'all' },
    { label: 'Department Health & SLAs', icon: Building2, route: '/admin/departments', role: 'admin' },
    { label: 'My Profile', icon: User, route: '/student/profile', role: 'all' },
    { label: 'System Settings', icon: Settings, route: '/student/settings', role: 'all' },
  ];

  const filteredComplaints = complaints.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.trackingNumber.toLowerCase().includes(query.toLowerCase()) ||
    c.location.toLowerCase().includes(query.toLowerCase()) ||
    c.assignedDepartmentName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredActions = quickActions.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectRoute = (route: string) => {
    onClose();
    navigate(route);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-theme-subtle bg-surface shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-theme-subtle bg-surface-elevated">
          <Search className="w-5 h-5 text-theme-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search complaints, campus locations, quick actions..."
            className="w-full bg-transparent text-sm text-theme-primary placeholder:text-theme-muted focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded bg-surface border border-theme-subtle text-theme-muted">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-theme-subtle">
          {/* Matching Complaints */}
          {filteredComplaints.length > 0 && (
            <div className="p-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-theme-muted mb-2 px-2">
                Active Complaints ({filteredComplaints.length})
              </p>
              <div className="space-y-1">
                {filteredComplaints.map(comp => (
                  <button
                    key={comp.id}
                    onClick={() => handleSelectRoute(`/student/complaints/${comp.id}`)}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-surface-hover transition-colors group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-brand-primary">{comp.trackingNumber}</span>
                        <span className="text-xs font-semibold text-theme-primary truncate">{comp.title}</span>
                      </div>
                      <p className="text-[11px] text-theme-muted truncate mt-0.5">{comp.location} • {comp.assignedDepartmentName}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-theme-muted group-hover:text-theme-primary shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="p-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-theme-muted mb-2 px-2">
              Quick Navigation
            </p>
            <div className="space-y-1">
              {filteredActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectRoute(action.route)}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-surface-hover transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-surface-elevated border border-theme-subtle flex items-center justify-center text-theme-muted group-hover:text-brand-primary transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-theme-primary">{action.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-theme-muted group-hover:text-theme-primary shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-surface-elevated border-t border-theme-subtle flex items-center justify-between text-[11px] text-theme-muted">
          <span>Navigate with cursor or keys</span>
          <span className="flex items-center gap-1 font-mono">
            SmartFix AI Unified Index
          </span>
        </div>
      </div>
    </div>
  );
};
