import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Users, GraduationCap, School, Wrench, ShieldCheck, ChevronDown, Check } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { role: UserRole; title: string; label: string; icon: React.ComponentType<{ className?: string }>; path: string }[] = [
    { role: 'student', title: 'Student Portal', label: 'Alex Rivera (CS)', icon: GraduationCap, path: '/student/dashboard' },
    { role: 'staff', title: 'Staff Dispatch', label: 'Marcus Jenkins (IT)', icon: Wrench, path: '/staff/dashboard' },
    { role: 'admin', title: 'Campus Admin', label: 'Dean Arthur Patel', icon: ShieldCheck, path: '/admin/dashboard' },
  ];

  const handleRoleSelect = (targetRole: UserRole, targetPath: string) => {
    switchRole(targetRole);
    setIsOpen(false);
    // If user is currently in a dashboard/portal view, redirect them to the new role's dashboard
    if (location.pathname.startsWith('/student') || 
        location.pathname.startsWith('/faculty') || 
        location.pathname.startsWith('/staff') || 
        location.pathname.startsWith('/admin')) {
      navigate(targetPath);
    }
  };

  const currentConfig = roles.find(r => r.role === currentUser.role) || roles[0];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="relative" ref={dropdownRef} id="role-switcher-container">
      <button
        id="role-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-theme-subtle bg-surface hover:bg-surface-hover text-theme-primary transition-colors text-xs font-medium shadow-sm"
      >
        <span className="flex items-center justify-center w-5 h-5 rounded-md bg-brand-primary/10 text-brand-primary">
          <CurrentIcon className="w-3.5 h-3.5" />
        </span>
        <span className="font-semibold capitalize hidden sm:inline">{currentUser.role}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated border border-theme-subtle text-theme-muted font-mono uppercase tracking-wider">
          Demo
        </span>
        <ChevronDown className="w-3 h-3 text-theme-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-theme-subtle bg-surface shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
          <div className="px-2 py-1.5 border-b border-theme-subtle mb-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Switch Demo Persona
            </p>
            <p className="text-[10px] text-theme-muted mt-0.5">Test role-specific workflows instantly</p>
          </div>

          <div className="space-y-1">
            {roles.map(r => {
              const Icon = r.icon;
              const isCurrent = currentUser.role === r.role;
              return (
                <button
                  key={r.role}
                  id={`role-btn-${r.role}`}
                  onClick={() => handleRoleSelect(r.role, r.path)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    isCurrent
                      ? 'bg-brand-primary/10 text-brand-primary font-medium'
                      : 'text-theme-secondary hover:bg-surface-hover hover:text-theme-primary'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`p-1.5 rounded-md ${isCurrent ? 'bg-brand-primary text-white' : 'bg-surface-elevated text-theme-secondary border border-theme-subtle'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div className="truncate">
                      <p className="text-xs font-semibold leading-tight capitalize">{r.role}</p>
                      <p className="text-[11px] text-theme-muted truncate">{r.label}</p>
                    </div>
                  </div>
                  {isCurrent && <Check className="w-4 h-4 text-brand-primary shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
