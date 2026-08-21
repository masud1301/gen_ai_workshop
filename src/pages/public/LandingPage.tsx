import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  Layers,
  Flame,
  CheckCircle2,
  Clock,
  Building2,
  FileSpreadsheet,
  MessageSquareOff,
  AlertOctagon,
  Copy,
  EyeOff,
  Search,
  Check,
  TrendingUp,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { WorkflowVisualizer } from '../../components/common/WorkflowVisualizer';
import { analyzeComplaintText } from '../../services/aiService';
import { PriorityBadge, StatusBadge, CategoryBadge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  // Interactive Live AI Sandbox on Landing Page
  const [demoPrompt, setDemoPrompt] = useState('The projector in Turing Lecture Hall 101 keeps turning black during CS301 morning lectures.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(() => analyzeComplaintText('Projector flickering in Turing Hall 101', demoPrompt));

  const handleTestAI = (sampleText?: string) => {
    const text = sampleText || demoPrompt;
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeComplaintText(text.slice(0, 40), text);
      setAnalysisResult(res);
      setIsAnalyzing(false);
    }, 450);
  };

  const sampleInputs = [
    'Air conditioner in Library 3rd floor is blowing hot air and making loud buzzing noises.',
    'Water pipe burst under sink in Science Block B 2nd floor washroom near Lab 204.',
    'Exposed electric wire sparking near Hostel Block C main staircase entrance.',
    'Hostel Wi-Fi keeps dropping every 5 minutes in Room 312 during online exam.',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-app text-theme-primary transition-colors">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Immersive ambient glowing radial mesh */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/40 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            {/* Top pill with pulsing dot */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Campus Intelligence V2.0</span>
            </div>

            {/* Main Headline with high-contrast gradient */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Turn Campus Complaints into <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">
                Smart Solutions.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              An AI-powered campus complaint platform that understands student problems, classifies issues, detects priority, routes complaints to the right department and helps administrators identify recurring campus problems.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/student/report"
                className="px-8 py-3.5 rounded-xl bg-white text-slate-950 font-bold hover:scale-105 hover:bg-slate-100 shadow-xl transition-all flex items-center gap-2 group text-sm"
              >
                Try SmartFix AI
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/student/dashboard"
                className="px-7 py-3.5 rounded-xl border border-slate-700 bg-slate-800/60 text-white font-semibold hover:bg-slate-800 shadow-sm hover:shadow transition-all text-sm"
              >
                View Live Demo
              </Link>
              <a
                href="#how-it-works"
                className="px-5 py-3.5 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                How It Works
              </a>
            </div>

            {/* Persona Quick-Launch Bar */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-500">Quick Portal Switch:</span>
              <button
                onClick={() => { switchRole('student'); navigate('/student/dashboard'); }}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white transition-colors font-medium text-xs"
              >
                Student Portal
              </button>
              <button
                onClick={() => { switchRole('faculty'); navigate('/faculty/dashboard'); }}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white transition-colors font-medium text-xs"
              >
                Faculty Portal
              </button>
              <button
                onClick={() => { switchRole('staff'); navigate('/staff/dashboard'); }}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white transition-colors font-medium text-xs"
              >
                Staff Dispatch
              </button>
              <button
                onClick={() => { switchRole('admin'); navigate('/admin/dashboard'); }}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white transition-colors font-medium text-xs"
              >
                Admin Analytics
              </button>
            </div>
          </div>

          {/* 2. HERO DASHBOARD PREVIEW CARD WITH IMMERSIVE WINDOW HEADER */}
          <div className="relative group">
            {/* Ambient subtle glow around preview card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-35 transition duration-500 pointer-events-none" />

            <div className="relative rounded-2xl border border-slate-700/50 bg-[#0f172a] shadow-2xl overflow-hidden">
              {/* Window Titlebar */}
              <div className="h-10 border-b border-slate-700/50 bg-slate-900/80 px-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SmartFix AI // Autonomous Dispatch Stream
                </div>
                <div className="w-12 text-right">
                  <span className="text-[10px] font-mono text-slate-500">v2.4</span>
                </div>
              </div>

              {/* Window Body */}
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-700/50">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400">
                      <span>INTERACTIVE NLP & ROUTING ENGINE</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-1">
                      Live Campus Complaint Classification Testbed
                    </h3>
                    <p className="text-xs text-slate-400">
                      Type any campus problem in conversational natural language. Watch SmartFix AI extract entities, calculate priority, and route the ticket live.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                      Tracking: SMART-2026-8812
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Auto-Dispatched
                    </span>
                  </div>
                </div>

                {/* Input sandbox */}
                <div className="my-6">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={demoPrompt}
                      onChange={e => setDemoPrompt(e.target.value)}
                      placeholder="Describe any campus issue (e.g. Wi-Fi dropping in Block C 3rd floor)..."
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/80 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      onClick={() => handleTestAI()}
                      disabled={isAnalyzing}
                      className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isAnalyzing ? 'Analyzing NLP...' : 'Run AI Analysis'}
                    </button>
                  </div>

                  {/* Sample prompt chips */}
                  <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1">
                    <span className="text-[11px] text-slate-400 shrink-0 font-medium">Try samples:</span>
                    {sampleInputs.map((sample, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setDemoPrompt(sample);
                          handleTestAI(sample);
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 whitespace-nowrap transition-colors shrink-0"
                      >
                        Sample {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Visual Output Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Category Card */}
                  <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
                      AI Category Detection
                    </span>
                    <CategoryBadge category={analysisResult.detectedCategory} />
                    <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Confidence:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {Math.round(analysisResult.confidenceScore * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Priority Scoring */}
                  <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
                      Calculated Priority
                    </span>
                    <PriorityBadge priority={analysisResult.recommendedPriority} />
                    <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 leading-tight">
                      {analysisResult.priorityRationale}
                    </p>
                  </div>

                  {/* Department Routing */}
                  <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
                      Department Assignment
                    </span>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-xs font-bold text-white capitalize">
                        {analysisResult.detectedCategory.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-400">
                      Est. SLA: <span className="font-mono font-semibold text-white">{analysisResult.estimatedResolutionHours} hrs</span>
                    </div>
                  </div>

                  {/* Entity Extraction */}
                  <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block mb-1 font-mono">
                      Extracted Entities
                    </span>
                    <div className="text-[11px] space-y-1 text-slate-300">
                      <p><strong className="text-white">Location:</strong> {analysisResult.extractedEntities.location || 'Detected from context'}</p>
                      <p><strong className="text-white">Item:</strong> {analysisResult.extractedEntities.equipmentOrItem || 'Campus amenity'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section className="py-20 border-t border-theme-subtle bg-surface-elevated/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500 font-mono">
              The Campus Reality
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-theme-primary mt-2">
              What Problem Are We Solving?
            </h2>
            <p className="mt-3 text-sm text-theme-secondary">
              Campus administration today is plagued by fragmented channels, lost paperwork, wrong routing, and zero visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Problem 1 */}
            <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
                <MessageSquareOff className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-theme-primary mb-2">Scattered Complaints</h4>
              <p className="text-xs text-theme-secondary leading-relaxed">
                Students report issues across scattered WhatsApp groups, informal verbal complaints to wardens, and manual paper registers that get lost.
              </p>
            </div>

            {/* Problem 2 */}
            <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-theme-primary mb-2">WhatsApp / Verbal / Paper Reporting</h4>
              <p className="text-xs text-theme-secondary leading-relaxed">
                No standardized data formatting. Crucial details like room numbers, equipment model, and urgency are missed in informal messages.
              </p>
            </div>

            {/* Problem 3 */}
            <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-theme-primary mb-2">Wrong Department Routing</h4>
              <p className="text-xs text-theme-secondary leading-relaxed">
                Complaints get assigned to the wrong technicians (e.g. electrical issues sent to plumbing), causing days of bureaucratic finger-pointing.
              </p>
            </div>

            {/* Problem 4 */}
            <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                <Copy className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-theme-primary mb-2">Duplicate Complaints</h4>
              <p className="text-xs text-theme-secondary leading-relaxed">
                When a library Wi-Fi router fails, 25 different students file 25 separate tickets, flooding staff inboxes with redundant duplicates.
              </p>
            </div>

            {/* Problem 5 */}
            <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-theme-primary mb-2">Delayed Resolution</h4>
              <p className="text-xs text-theme-secondary leading-relaxed">
                Without dynamic priority classification, minor cosmetic flaws get handled before critical safety risks and academic exam hall failures.
              </p>
            </div>

            {/* Problem 6 */}
            <div className="p-6 rounded-2xl border border-theme-subtle bg-surface shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <EyeOff className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-theme-primary mb-2">No Centralized Visibility</h4>
              <p className="text-xs text-theme-secondary leading-relaxed">
                Deans and university administrators have zero analytics to identify which hostel blocks have chronic infrastructure failures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOLUTION ARCHITECTURE SECTION */}
      <section className="py-20 border-t border-theme-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary font-mono">
              The Intelligent Layer
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-theme-primary mt-2">
              One Smart Complaint Platform
            </h2>
            <p className="mt-3 text-sm text-theme-secondary">
              SmartFix AI acts as the central cognitive nervous system between students, departments, and leadership.
            </p>
          </div>

          {/* Centralized Visual Diagram: Student -> SmartFix AI -> Department -> Resolution -> Insights */}
          <div className="p-6 sm:p-10 rounded-3xl border border-theme-subtle bg-surface shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
              {/* Step 1: Student */}
              <div className="p-5 rounded-2xl bg-surface-elevated border border-theme-subtle text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h5 className="text-sm font-bold text-theme-primary">Student</h5>
                <p className="text-[11px] text-theme-muted mt-1">Natural language input via mobile web app</p>
              </div>

              {/* Arrow 1 */}
              <div className="hidden sm:flex justify-center text-theme-muted">
                <ArrowRight className="w-6 h-6 text-brand-primary animate-pulse" />
              </div>

              {/* Step 2: SmartFix AI Centerpiece */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-teal-700 text-white text-center flex flex-col items-center shadow-lg relative sm:-my-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center mb-3 backdrop-blur-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h5 className="text-sm font-extrabold tracking-tight">SmartFix AI</h5>
                <p className="text-[11px] text-blue-100 mt-1">
                  NLP classification, priority scoring & de-duplication
                </p>
              </div>

              {/* Arrow 2 */}
              <div className="hidden sm:flex justify-center text-theme-muted">
                <ArrowRight className="w-6 h-6 text-teal-500 animate-pulse" />
              </div>

              {/* Step 3: Department & Resolution */}
              <div className="p-5 rounded-2xl bg-surface-elevated border border-theme-subtle text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="text-sm font-bold text-theme-primary">Resolution & Insights</h5>
                <p className="text-[11px] text-theme-muted mt-1">Technician dispatch & executive campus analytics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MAIN 10-STEP WORKFLOW SECTION */}
      <section id="how-it-works" className="py-20 border-t border-theme-subtle bg-surface-elevated/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WorkflowVisualizer />
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="py-20 border-t border-theme-subtle bg-surface">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-6 border border-brand-primary/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-theme-primary">
            Ready to upgrade your campus issue resolution?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-theme-secondary max-w-xl mx-auto">
            Experience how SmartFix AI modernizes university infrastructure maintenance with autonomous classification and priority dispatch.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/student/report"
              className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold shadow-lg transition-all flex items-center gap-2"
            >
              Report an Issue Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-surface border border-theme-subtle hover:border-theme-strong text-theme-primary text-sm font-semibold transition-all"
            >
              Access Demo Accounts
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
