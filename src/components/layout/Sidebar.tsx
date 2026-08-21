import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  PlusCircle,
  FileText,
  Bell,
  Search,
  User,
  Settings,
  HelpCircle,
  Building2,
  Users,
  BarChart3,
  Flame,
  CheckCircle2,
  Clock,
  Radio,
  BookOpen,
  Wrench,
  Activity,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';

interface SidebarProps {
  onCloseMobile?: () => void;
  onOpenAIAssistant?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile, onOpenAIAssistant }) => {
  const { currentUser } = useAuth();
  const { unreadNotificationCount, complaints } = useComplaints();
  const location = useLocation();

  // Role-specific nav configurations strictly focused on core product
  const studentNav = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Report Issue', path: '/student/report', icon: PlusCircle, highlight: true },
    { label: 'My Complaints', path: '/student/complaints', icon: FileText, count: complaints.filter(c => c.submittedBy.id === currentUser.id).length },
    { label: 'Notifications', path: '/student/notifications', icon: Bell, badgeCount: unreadNotificationCount },
    { label: 'Profile', path: '/student/profile', icon: User },
  ];

  const facultyNav = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Report Issue', path: '/student/report', icon: PlusCircle, highlight: true },
    { label: 'My Complaints', path: '/student/complaints', icon: FileText },
    { label: 'Notifications', path: '/student/notifications', icon: Bell, badgeCount: unreadNotificationCount },
    { label: 'Profile', path: '/student/profile', icon: User },
  ];

  const staffNav = [
    { label: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
    { label: 'Assigned Issues', path: '/staff/queue', icon: Wrench, count: complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length },
    { label: 'All Issues', path: '/student/complaints', icon: FileText, count: complaints.length },
    { label: 'Profile', path: '/student/profile', icon: User },
  ];

  const adminNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'All Issues', path: '/student/complaints', icon: FileText, count: complaints.length },
    { label: 'Departments', path: '/admin/departments', icon: Building2 },
    { label: 'Insights', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/student/settings', icon: Settings },
  ];

  const navItems =
    currentUser.role === 'student'
      ? studentNav
      : currentUser.role === 'faculty'
      ? facultyNav
      : currentUser.role === 'staff'
      ? staffNav
      : adminNav;

  return (
    <aside className="w-64 flex flex-col h-full bg-surface border-r border-theme-subtle select-none">
      {/* Role Title Ribbon */}
      <div className="p-4 border-b border-theme-subtle bg-surface-elevated/40">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">
            {currentUser.role} Workspace
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
        </div>
        <p className="text-xs font-semibold text-theme-primary truncate mt-1">
          {currentUser.name}
        </p>
        <p className="text-[11px] text-theme-muted truncate">
          {currentUser.department || 'Campus Operations'}
        </p>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item, idx) => {
          const Icon = item.icon;

          if (item.action) {
            return (
              <button
                key={idx}
                onClick={() => {
                  item.action?.();
                  onCloseMobile?.();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/20 transition-colors group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          }

          if (!item.path) return null;

          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'));

          return (
            <NavLink
              key={idx}
              to={item.path}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                item.highlight
                  ? 'bg-brand-primary text-white shadow-sm hover:bg-brand-primary-hover font-semibold'
                  : isActive
                  ? 'bg-brand-primary/10 text-brand-primary font-semibold border border-brand-primary/20'
                  : 'text-theme-secondary hover:text-theme-primary hover:bg-surface-hover'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    item.highlight
                      ? 'text-white'
                      : isActive
                      ? 'text-brand-primary'
                      : 'text-theme-muted'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white shrink-0">
                  {item.badgeCount}
                </span>
              )}

              {item.count !== undefined && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-elevated text-theme-muted border border-theme-subtle shrink-0">
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Footer */}
      <div className="p-3.5 border-t border-theme-subtle bg-surface-elevated/20">
        <div className="flex items-center justify-between text-[11px] text-theme-muted">
          <span>SMARTFIX AI</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface border border-theme-subtle">v2.4</span>
        </div>
      </div>
    </aside>
  );
};
