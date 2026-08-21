import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  School,
  Sparkles,
  PlusCircle,
  AlertOctagon,
  Tv,
  CheckCircle2,
  Clock,
  ArrowRight,
  Monitor,
  Flame,
  Layers,
  Wrench,
  ThumbsUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { StatCard } from '../../components/common/StatCard';
import { PriorityBadge, StatusBadge, CategoryBadge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const FacultyDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { complaints, submitComplaint } = useComplaints();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyRoom, setEmergencyRoom] = useState('Turing Hall 101');
  const [emergencyIssue, setEmergencyIssue] = useState('Projector / Display Failure during Active Class');

  const classroomComplaints = complaints.filter(
    c => c.category === 'classroom_equipment' || c.category === 'it_network' || c.submittedBy.role === 'faculty'
  );

  const activeRequests = classroomComplaints.filter(c => c.status !== 'resolved' && c.status !== 'closed');
  const resolvedRequests = classroomComplaints.filter(c => c.status === 'resolved' || c.status === 'closed');

  const handleQuickEmergencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await submitComplaint({
      title: `[URGENT CLASSROOM] ${emergencyIssue} in ${emergencyRoom}`,
      description: `Faculty report by ${currentUser.name}: Immediate technical assistance needed in ${emergencyRoom}. Ongoing lecture affected.`,
      building: 'Academic Block A',
      roomNumber: emergencyRoom,
      location: 'Main Academic Quad',
      category: 'classroom_equipment',
      priority: 'high',
      submittedBy: {
        id: currentUser.id,
        name: currentUser.name,
        role: 'faculty',
        email: currentUser.email,
        roomOrOffice: currentUser.roomOrOffice,
      },
    });

    setIsEmergencyModalOpen(false);
    showToast('High-Priority Dispatch Triggered', `Technician alerted for ${emergencyRoom} (Ticket ${created.trackingNumber})`, 'success');
    navigate(`/student/complaints/${created.id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in" id="faculty-dashboard">
      {/* Top Banner */}
      <div className="rounded-2xl border border-theme-subtle bg-surface p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Faculty Portal
              </span>
              <span className="text-xs text-theme-muted">
                {currentUser.department || 'Dept. of Electrical & Computer Engineering'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-theme-primary">
              Welcome, {currentUser.name} 🎓
            </h1>
            <p className="text-xs sm:text-sm text-theme-secondary mt-1 max-w-xl">
              Manage lecture hall AV systems, submit rapid maintenance tickets, and track department facility SLAs.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 animate-pulse"
            >
              <AlertOctagon className="w-4 h-4" />
              Classroom AV Emergency
            </button>
            <Link
              to="/student/report"
              className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              New Lab / Facility Request
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active AV / Lab Requests"
          value={activeRequests.length}
          subtitle="Currently assigned to IT / AV"
          icon={Tv}
          variant="amber"
          onClick={() => navigate('/faculty/requests')}
        />
        <StatCard
          title="Classrooms Monitored"
          value={18}
          subtitle="All academic wings"
          icon={Monitor}
          variant="blue"
          onClick={() => navigate('/faculty/classrooms')}
        />
        <StatCard
          title="Avg Dispatch Time"
          value="18 min"
          subtitle="Faculty priority tier"
          icon={Clock}
          variant="purple"
        />
        <StatCard
          title="Resolved This Term"
          value={resolvedRequests.length}
          subtitle="98.2% on-time SLA"
          icon={CheckCircle2}
          variant="emerald"
          onClick={() => navigate('/faculty/requests')}
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Classroom & Lab Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-theme-primary">Classroom & Department Infrastructure Queue</h3>
              <p className="text-xs text-theme-muted">Tracking high-priority academic disruption tickets</p>
            </div>
            <Link to="/faculty/requests" className="text-xs text-brand-primary hover:underline font-semibold flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {classroomComplaints.slice(0, 4).map(comp => (
              <div
                key={comp.id}
                className="p-5 rounded-2xl border border-theme-subtle bg-surface hover:border-theme-strong hover:shadow-md transition-all group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand-primary">
                      {comp.trackingNumber}
                    </span>
                    <CategoryBadge category={comp.category} size="sm" />
                    <PriorityBadge priority={comp.priority} size="sm" />
                  </div>
                  <StatusBadge status={comp.status} size="sm" />
                </div>

                <Link to={`/student/complaints/${comp.id}`}>
                  <h4 className="text-sm font-bold text-theme-primary group-hover:text-brand-primary transition-colors">
                    {comp.title}
                  </h4>
                </Link>

                <p className="text-xs text-theme-secondary mt-1 line-clamp-2">
                  {comp.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-theme-subtle text-xs text-theme-muted">
                  <div className="flex items-center gap-3">
                    <span>📍 {comp.building} ({comp.roomNumber || comp.location})</span>
                    <span>🏢 {comp.assignedDepartmentName}</span>
                  </div>

                  <Link
                    to={`/student/complaints/${comp.id}`}
                    className="px-3 py-1 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-theme-subtle text-xs font-semibold text-theme-primary transition-colors flex items-center gap-1"
                  >
                    Track <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Classroom Quick Status */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-theme-primary">Lecture Hall AV Health</h3>
              <Link to="/faculty/classrooms" className="text-xs text-brand-primary hover:underline font-semibold">
                All Rooms
              </Link>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Turing Hall 101', status: 'Maintenance', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', desc: 'Projector color calibration' },
                { name: 'Science Lab 204', status: 'Operational', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', desc: 'All AV & stations online' },
                { name: 'Engineering Hall 3', status: 'Operational', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', desc: '4K dual display ready' },
                { name: 'Seminar Room B', status: 'Issue Reported', badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', desc: 'Mic audio buzzing' },
              ].map((hall, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-surface-elevated border border-theme-subtle flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-theme-primary">{hall.name}</p>
                    <p className="text-[11px] text-theme-muted">{hall.desc}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hall.badge}`}>
                    {hall.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Modal */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-rose-500/30 bg-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-theme-primary">Classroom AV Emergency Dispatch</h3>
                <p className="text-xs text-theme-muted">Alerts on-duty IT/AV technician immediately with High Priority SLA</p>
              </div>
            </div>

            <form onSubmit={handleQuickEmergencySubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1">Lecture Hall / Classroom</label>
                <select
                  value={emergencyRoom}
                  onChange={e => setEmergencyRoom(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-rose-500"
                >
                  <option value="Turing Hall 101">Turing Hall 101 (Main Lecture Theatre)</option>
                  <option value="Science Lab 204">Science Block B - Lab 204</option>
                  <option value="Engineering Hall 3">Engineering Hall 3</option>
                  <option value="Auditorium Main">Main Campus Auditorium</option>
                  <option value="Seminar Room B">Seminar Room B (Library Wing)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1">Urgent Failure Type</label>
                <select
                  value={emergencyIssue}
                  onChange={e => setEmergencyIssue(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary focus:outline-none focus:border-rose-500"
                >
                  <option value="Projector / Display Failure during Active Class">Projector / Display Failure during Active Class</option>
                  <option value="Audio / Wireless Microphone Dead">Audio / Wireless Microphone Dead</option>
                  <option value="Instructor Podium PC Not Booting">Instructor Podium PC Not Booting</option>
                  <option value="Classroom Air Conditioning Failure (Severe Heat)">Classroom Air Conditioning Failure (Severe Heat)</option>
                  <option value="Power Trip in Lecture Hall">Power Trip in Lecture Hall</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-theme-subtle">
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-theme-secondary hover:bg-surface-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
                >
                  <AlertOctagon className="w-4 h-4" />
                  Trigger Emergency Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
