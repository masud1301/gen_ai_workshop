import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Building, MapPin, GraduationCap, ShieldCheck, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { useToast } from '../../context/ToastContext';

export const StudentProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { complaints } = useComplaints();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [roomOrOffice, setRoomOrOffice] = useState(currentUser.roomOrOffice || 'Hostel Block C, Room 312');
  const [department, setDepartment] = useState(currentUser.department || 'Computer Science & Engineering');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '+1 (555) 019-2831');

  const myComplaints = complaints.filter(c => c.submittedBy.id === currentUser.id);
  const resolvedCount = myComplaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      roomOrOffice,
      department,
      phoneNumber,
    });
    setIsEditing(false);
    showToast('Profile updated', 'Your campus credentials have been saved', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in" id="student-profile-page">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-theme-muted mb-1">
          <Link to="/student/dashboard" className="hover:text-theme-primary">Dashboard</Link>
          <span>/</span>
          <span className="text-theme-primary font-semibold">User Profile</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-theme-primary">
          Campus Profile & Credentials
        </h1>
        <p className="text-xs text-theme-secondary mt-1">
          Manage your verified student ID, hostel accommodation, and resolution records.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-theme-subtle">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-theme-primary">{currentUser.name}</h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-theme-secondary mt-0.5">{currentUser.email}</p>
              <p className="text-xs font-mono text-brand-primary mt-1 font-semibold">
                ID: {currentUser.studentId || 'ST-2026-8812'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-theme-subtle text-xs font-semibold text-theme-primary transition-colors self-start sm:self-auto"
          >
            {isEditing ? 'Cancel' : 'Edit Information'}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-surface-elevated border border-theme-subtle">
            <span className="text-xl font-extrabold text-theme-primary font-mono">{myComplaints.length}</span>
            <p className="text-[11px] text-theme-muted mt-0.5">Tickets Filed</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-elevated border border-theme-subtle">
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{resolvedCount}</span>
            <p className="text-[11px] text-theme-muted mt-0.5">Resolved</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-elevated border border-theme-subtle">
            <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">100%</span>
            <p className="text-[11px] text-theme-muted mt-0.5">AI Routing Rate</p>
          </div>
        </div>

        {/* Details Form / View */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1">Academic Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1">Hostel Room / Location</label>
                <input
                  type="text"
                  value={roomOrOffice}
                  onChange={e => setRoomOrOffice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover shadow-sm"
            >
              Save Profile Changes
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-surface-elevated border border-theme-subtle">
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block mb-1">Academic Department</span>
              <p className="font-semibold text-theme-primary">{currentUser.department || 'Computer Science & Engineering'}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-elevated border border-theme-subtle">
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block mb-1">Hostel Room / Location</span>
              <p className="font-semibold text-theme-primary">{currentUser.roomOrOffice || 'Hostel Block C, Room 312'}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-elevated border border-theme-subtle">
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block mb-1">Contact Phone</span>
              <p className="font-semibold text-theme-primary">{currentUser.phoneNumber || '+1 (555) 019-2831'}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-elevated border border-theme-subtle">
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block mb-1">Account Verification</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> University LDAP Verified
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
