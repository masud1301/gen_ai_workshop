import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Cpu, Heart, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-theme-subtle bg-surface transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-theme-primary">
                SMARTFIX AI
              </span>
            </div>
            <p className="text-xs text-theme-muted leading-relaxed">
              Turn Campus Complaints into Smart, Actionable Solutions with Autonomous Classification, Priority Routing & Root-Cause Analytics.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Operational • AI Engine Active
            </div>
          </div>

          {/* Solution */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-theme-primary mb-3">
              Platform Workflow
            </h5>
            <ul className="space-y-2 text-xs text-theme-secondary">
              <li><Link to="/student/report" className="hover:text-theme-primary transition-colors">Natural Language Report</Link></li>
              <li><Link to="/student/complaints" className="hover:text-theme-primary transition-colors">AI Priority Scoring</Link></li>
              <li><Link to="/student/complaints" className="hover:text-theme-primary transition-colors">Similarity Detection</Link></li>
              <li><Link to="/admin/departments" className="hover:text-theme-primary transition-colors">Auto Department Dispatch</Link></li>
              <li><Link to="/admin/analytics" className="hover:text-theme-primary transition-colors">Recurring Problem Analytics</Link></li>
            </ul>
          </div>

          {/* Quick Portals */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-theme-primary mb-3">
              Role Portals
            </h5>
            <ul className="space-y-2 text-xs text-theme-secondary">
              <li><Link to="/student/dashboard" className="hover:text-theme-primary transition-colors">Student Resolution Center</Link></li>
              <li><Link to="/faculty/dashboard" className="hover:text-theme-primary transition-colors">Faculty AV & Lab Requests</Link></li>
              <li><Link to="/staff/dashboard" className="hover:text-theme-primary transition-colors">Staff Maintenance Queue</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-theme-primary transition-colors">Campus Executive Admin</Link></li>
              <li><Link to="/student/lost-found" className="hover:text-theme-primary transition-colors">Smart Lost & Found</Link></li>
            </ul>
          </div>

          {/* Architecture info */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-theme-primary mb-3">
              System Architecture
            </h5>
            <div className="p-3 rounded-xl border border-theme-subtle bg-surface-elevated text-xs space-y-2 text-theme-muted">
              <div className="flex items-center justify-between">
                <span>Classification Engine</span>
                <span className="font-mono text-[11px] text-theme-primary">NLP v3.2</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Avg. Routing Latency</span>
                <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">&lt; 1.2s</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Campus SLA Target</span>
                <span className="font-mono text-[11px] text-theme-primary">96.5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-theme-muted">
          <p>© {new Date().getFullYear()} SMARTFIX AI. Turn Campus Complaints into Smart, Actionable Solutions.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="font-mono text-[11px]">Final Year Project / Hackathon Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
