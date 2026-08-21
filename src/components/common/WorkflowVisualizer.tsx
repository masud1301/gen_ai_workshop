import React, { useState } from 'react';
import {
  FileText,
  BrainCircuit,
  Binary,
  Layers,
  Flame,
  CopyCheck,
  Building2,
  Wrench,
  BellRing,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkflowStep {
  step: string;
  title: string;
  category: 'Student' | 'AI Intelligence' | 'Department Staff' | 'Administration';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  aiDetail: string;
  badge: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: '01',
    title: 'Student submits complaint',
    category: 'Student',
    icon: FileText,
    description: 'Student or faculty reports an issue using conversational plain English or photo upload.',
    aiDetail: 'Accepts unstructured mobile reports, room numbers, voice dictation, and attachments.',
    badge: 'Input',
  },
  {
    step: '02',
    title: 'AI understands natural language',
    category: 'AI Intelligence',
    icon: BrainCircuit,
    description: 'NLP transformer models analyze semantics, tone, context, and emotional distress markers.',
    aiDetail: 'Interprets colloquial terms (e.g., "AC is blowing hot air in Block C") into structured parameters.',
    badge: 'Semantic NLP',
  },
  {
    step: '03',
    title: 'Information extraction',
    category: 'AI Intelligence',
    icon: Binary,
    description: 'Extracts exact entities: campus block, specific floor, equipment type, and blast radius.',
    aiDetail: 'Isolates variables: Location="Hostel C", Floor=3, Item="Cisco AP", Affected="30+ students".',
    badge: 'Entity Parser',
  },
  {
    step: '04',
    title: 'Complaint classification',
    category: 'AI Intelligence',
    icon: Layers,
    description: 'Maps the issue into high-accuracy categories across 8 specialized campus departments.',
    aiDetail: '98.4% categorical accuracy mapping across Network, Electrical, Plumbing, AV, Food, Safety.',
    badge: 'Categorizer',
  },
  {
    step: '05',
    title: 'Priority detection',
    category: 'AI Intelligence',
    icon: Flame,
    description: 'Computes dynamic severity score considering exam schedules, hazard risks, and crowd impact.',
    aiDetail: 'Critical safety issues (sparks, open leaks) trigger instant bypass straight to P1 emergency queue.',
    badge: 'Risk Scoring',
  },
  {
    step: '06',
    title: 'Similar complaint detection',
    category: 'AI Intelligence',
    icon: CopyCheck,
    description: 'Clusters duplicate complaints into parent tickets to prevent staff queue fragmentation.',
    aiDetail: 'Cosine vector similarity identifies when 5 students report the same broken hallway light.',
    badge: 'De-Duplication',
  },
  {
    step: '07',
    title: 'Department assignment',
    category: 'AI Intelligence',
    icon: Building2,
    description: 'Auto-routes work orders to active on-duty staff based on skill, location, and queue depth.',
    aiDetail: 'Load-balances maintenance technicians to meet strict campus SLA turnaround targets.',
    badge: 'Smart Routing',
  },
  {
    step: '08',
    title: 'Staff resolves issue',
    category: 'Department Staff',
    icon: Wrench,
    description: 'Technician receives task on mobile, executes physical repair, and logs completion proofs.',
    aiDetail: 'Allows technicians to post resolution notes, diagnostic photos, and repair checklists.',
    badge: 'Resolution',
  },
  {
    step: '09',
    title: 'Student receives update',
    category: 'Student',
    icon: BellRing,
    description: 'Instant notification dispatched with resolution timestamp and satisfaction verification.',
    aiDetail: 'Student can confirm repair quality and submit 1-5 star feedback rating directly.',
    badge: 'Feedback Loop',
  },
  {
    step: '10',
    title: 'AI analyzes recurring problems',
    category: 'Administration',
    icon: TrendingUp,
    description: 'Aggregates historical trends to diagnose infrastructure bottlenecks and budget needs.',
    aiDetail: 'Flags recurring failures (e.g. "Block C Wi-Fi switch has failed 4 times this month - recommend replacement").',
    badge: 'Root-Cause AI',
  },
];

export const WorkflowVisualizer: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const startSimulation = () => {
    setIsSimulating(true);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < WORKFLOW_STEPS.length) {
        setActiveStepIndex(current);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1200);
  };

  const activeStep = WORKFLOW_STEPS[activeStepIndex];
  const ActiveIcon = activeStep.icon;

  return (
    <div className="w-full rounded-2xl border border-theme-subtle bg-surface p-6 lg:p-8 shadow-lg relative overflow-hidden" id="workflow-visualizer">
      {/* Background ambient decorative glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-theme-subtle relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            End-to-End Autonomous Lifecycle
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-theme-primary">
            The 10-Step SmartFix AI Resolution Engine
          </h3>
          <p className="text-sm text-theme-secondary mt-1">
            How natural language campus complaints are classified, routed, resolved, and audited in real-time.
          </p>
        </div>

        <button
          onClick={startSimulation}
          disabled={isSimulating}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50 shrink-0 self-start md:self-auto"
        >
          {isSimulating ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              Simulating Workflow...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Simulate 10-Step AI Flow
            </>
          )}
        </button>
      </div>

      {/* Steps Grid / Timeline */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8 relative z-10">
        {WORKFLOW_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStepIndex;
          const isPassed = idx < activeStepIndex;

          return (
            <button
              key={step.step}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-3 rounded-xl text-left border transition-all relative group ${
                isActive
                  ? 'bg-surface-elevated border-brand-primary ring-2 ring-brand-primary/20 shadow-md'
                  : isPassed
                  ? 'bg-surface-elevated/60 border-emerald-500/30 text-theme-secondary hover:border-theme-strong'
                  : 'bg-surface border-theme-subtle text-theme-muted hover:border-theme-strong hover:text-theme-primary'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-brand-primary text-white'
                      : isPassed
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-surface-elevated text-theme-muted'
                  }`}
                >
                  {step.step}
                </span>
                {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </div>

              <div className="flex items-center gap-2 mb-1">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-brand-primary' : isPassed ? 'text-emerald-500' : 'text-theme-muted'
                  }`}
                />
                <span className="text-xs font-semibold truncate text-theme-primary">
                  {step.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep Dive Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep.step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-xl border border-theme-subtle bg-surface-elevated relative z-10 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-theme-subtle mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 border border-brand-primary/20">
                <ActiveIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-primary">
                    STEP {activeStep.step} / 10
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-theme-subtle font-medium text-theme-muted">
                    {activeStep.category}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-theme-primary mt-0.5">
                  {activeStep.title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                disabled={activeStepIndex === 0}
                className="px-3 py-1.5 rounded-lg border border-theme-subtle bg-surface text-xs font-medium text-theme-secondary hover:text-theme-primary disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setActiveStepIndex(prev => Math.min(WORKFLOW_STEPS.length - 1, prev + 1))}
                disabled={activeStepIndex === WORKFLOW_STEPS.length - 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-medium hover:bg-brand-primary-hover disabled:opacity-40"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surface border border-theme-subtle">
              <p className="text-xs font-semibold uppercase tracking-wider text-theme-muted mb-1">
                Operational Action
              </p>
              <p className="text-sm text-theme-secondary leading-relaxed">
                {activeStep.description}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Intelligence Mechanism
              </p>
              <p className="text-sm text-theme-secondary leading-relaxed font-mono text-xs">
                {activeStep.aiDetail}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
