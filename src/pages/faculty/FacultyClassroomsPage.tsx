import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Monitor, Tv, Wifi, AlertTriangle, CheckCircle2, PlusCircle, Sparkles, Building2 } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';

interface ClassroomInfo {
  id: string;
  name: string;
  building: string;
  type: 'Lecture Theatre' | 'Computer Lab' | 'Science Lab' | 'Seminar Room';
  capacity: number;
  status: 'Operational' | 'Maintenance' | 'Critical Issue';
  equipment: string[];
  activeTicketId?: string;
  activeTicketTitle?: string;
}

const CLASSROOMS: ClassroomInfo[] = [
  {
    id: 'cr_1',
    name: 'Turing Lecture Hall 101',
    building: 'Academic Block A',
    type: 'Lecture Theatre',
    capacity: 250,
    status: 'Maintenance',
    equipment: ['4K Laser Projector', 'Wireless Lapel Mic', 'Document Camera', 'Smart Podium'],
    activeTicketId: 'comp_1',
    activeTicketTitle: 'Flickering 4K overhead projector during CS lectures',
  },
  {
    id: 'cr_2',
    name: 'Software Engineering Lab 202',
    building: 'Turing Complex',
    type: 'Computer Lab',
    capacity: 60,
    status: 'Operational',
    equipment: ['60x Dell Core-i9 Desktops', 'Dual Gigabit Ethernet', 'High-Lumen Projector'],
  },
  {
    id: 'cr_3',
    name: 'Science Complex Lab 204',
    building: 'Science Block B',
    type: 'Science Lab',
    capacity: 45,
    status: 'Critical Issue',
    equipment: ['Fume Hoods', 'Digital Microscopes', 'Wash Station Sink'],
    activeTicketId: 'comp_4',
    activeTicketTitle: 'Water pipe leak under washroom sink near Lab 204',
  },
  {
    id: 'cr_4',
    name: 'Engineering Hall 3',
    building: 'Engineering Block E',
    type: 'Lecture Theatre',
    capacity: 180,
    status: 'Operational',
    equipment: ['Dual Display Screen', 'Surround Acoustics', 'Lecture Capture System'],
  },
  {
    id: 'cr_5',
    name: 'Seminar Room B (Library Wing)',
    building: 'Central Library',
    type: 'Seminar Room',
    capacity: 35,
    status: 'Operational',
    equipment: ['75" Interactive Touch Display', 'Polycom Video Bar'],
  },
  {
    id: 'cr_6',
    name: 'Physics Optics Lab 105',
    building: 'Science Block B',
    type: 'Science Lab',
    capacity: 30,
    status: 'Operational',
    equipment: ['Laser Optical Benches', 'Oscilloscopes'],
  },
];

export const FacultyClassroomsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = CLASSROOMS.filter(c => {
    if (filterType !== 'all' && c.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in" id="faculty-classrooms-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-theme-muted mb-1">
            <Link to="/faculty/dashboard" className="hover:text-theme-primary">Faculty Portal</Link>
            <span>/</span>
            <span className="text-theme-primary font-semibold">Classrooms & AV Status</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-theme-primary">
            Academic Spaces & AV Readiness
          </h1>
          <p className="text-xs text-theme-secondary mt-1">
            Real-time equipment health, projector status, and fast issue reporting for lecture halls.
          </p>
        </div>

        <Link
          to="/student/report"
          className="px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Report Room Problem
        </Link>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'Lecture Theatre', 'Computer Lab', 'Science Lab', 'Seminar Room'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === t
                ? 'bg-brand-primary text-white'
                : 'bg-surface border border-theme-subtle text-theme-secondary hover:text-theme-primary'
            }`}
          >
            {t === 'all' ? 'All Spaces' : t}
          </button>
        ))}
      </div>

      {/* Classrooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(room => (
          <div
            key={room.id}
            className="p-5 rounded-2xl border border-theme-subtle bg-surface shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-elevated text-theme-muted border border-theme-subtle">
                  {room.type} • Cap: {room.capacity}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    room.status === 'Operational'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : room.status === 'Maintenance'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {room.status === 'Operational' ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  {room.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-theme-primary">{room.name}</h3>
                <p className="text-xs text-theme-muted">{room.building}</p>
              </div>

              {/* Equipment list */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block mb-1">
                  Installed Amenities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {room.equipment.map((eq, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-surface-elevated border border-theme-subtle text-theme-secondary"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Ticket notice if any */}
              {room.activeTicketTitle && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                  <span className="font-bold text-amber-700 dark:text-amber-300 block text-[11px]">
                    Active Maintenance Ticket:
                  </span>
                  <Link
                    to={`/student/complaints/${room.activeTicketId}`}
                    className="text-theme-primary hover:underline line-clamp-1 mt-0.5"
                  >
                    {room.activeTicketTitle}
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-theme-subtle flex items-center justify-between">
              <span className="text-xs text-theme-muted font-mono">Status Live</span>
              <button
                onClick={() => navigate('/student/report')}
                className="px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-theme-subtle text-xs font-semibold text-theme-primary transition-colors"
              >
                Report Issue
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
