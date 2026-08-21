import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Filter, ShieldCheck, CheckCircle2, User as UserIcon, Ban, RefreshCw, PlusCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, UserRole } from '../../types';
import { db } from '../../services/db';

export const AdminUsersPage: React.FC = () => {
  const { switchRole } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>(() => db.users.getAll());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newDept, setNewDept] = useState('Computer Science & Engineering');
  const [newId, setNewId] = useState('');
  const [newRoom, setNewRoom] = useState('');

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setUsers(db.users.getAll());
    });
    return () => unsub();
  }, []);

  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.studentId && u.studentId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const toggleUserStatus = (userId: string) => {
    const target = db.users.getById(userId);
    if (!target) return;
    const nextStatus = target.status === 'active' ? 'suspended' : 'active';
    db.users.update(userId, { status: nextStatus });
    showToast('User Status Updated', `${target.name} is now ${nextStatus}`, 'info');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    db.users.create({
      name: newName,
      email: newEmail,
      role: newRole,
      department: newDept,
      studentId: newRole === 'student' ? newId || `ST-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      roomOrOffice: newRoom,
      status: 'active',
    });

    showToast('User Created', `${newName} added to persistent campus database`, 'success');
    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewRoom('');
    setNewId('');
  };

  return (
    <div className="space-y-6 animate-in fade-in" id="admin-users-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-theme-muted mb-1">
            <Link to="/admin/dashboard" className="hover:text-theme-primary">Admin Cockpit</Link>
            <span>/</span>
            <span className="text-theme-primary font-semibold">User Directory</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-theme-primary">
            Campus User & Role Directory
          </h1>
          <p className="text-xs text-theme-secondary mt-1">
            Manage authenticated students, faculty members, dispatch technicians, and role permissions.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl border border-theme-subtle bg-surface shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student name, ID number, or university email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
          />
        </div>

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
        >
          <option value="all">All Roles ({users.length})</option>
          <option value="student">Students ({users.filter(u => u.role === 'student').length})</option>
          <option value="faculty">Faculty ({users.filter(u => u.role === 'faculty').length})</option>
          <option value="staff">Staff Technicians ({users.filter(u => u.role === 'staff').length})</option>
          <option value="admin">Administrators ({users.filter(u => u.role === 'admin').length})</option>
        </select>
      </div>

      {/* Table */}
      <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-theme-subtle text-theme-muted">
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Identifier / Dept</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold text-center">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-surface-elevated transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-surface-elevated border border-theme-subtle flex items-center justify-center font-bold text-xs text-theme-primary">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-theme-primary">{u.name}</p>
                        <p className="text-[11px] text-theme-muted">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 uppercase">
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 text-theme-secondary font-mono text-[11px]">
                    {u.studentId || u.department || 'Campus Operations'}
                  </td>

                  <td className="py-3 text-theme-muted text-[11px]">
                    {u.roomOrOffice || 'N/A'}
                  </td>

                  <td className="py-3 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className="px-2.5 py-1 rounded-lg border border-theme-subtle hover:bg-surface-elevated text-[11px] font-semibold text-theme-secondary transition-colors"
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-theme-subtle bg-surface p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-theme-primary">Add Campus Account</h3>
            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1">Role</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="staff">Staff Technician</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1">University Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="jordan.smith@campus.edu"
                  className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-theme-secondary mb-1">ID Number</label>
                  <input
                    type="text"
                    value={newId}
                    onChange={e => setNewId(e.target.value)}
                    placeholder="ST-2026-9099"
                    className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-theme-secondary mb-1">Room / Office</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={e => setNewRoom(e.target.value)}
                    placeholder="Main Block Rm 204"
                    className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-theme-subtle">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-theme-secondary hover:bg-surface-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
