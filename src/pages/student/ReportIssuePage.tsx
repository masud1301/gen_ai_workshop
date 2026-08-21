import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Upload,
  Check,
  Building2,
  HelpCircle,
  ThumbsUp
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  analyzeComplaintWithLLM,
  ComplaintAnalysisOutput,
} from '../../services/aiService';
import { StandardCategory, StandardPriority } from '../../types';

export const ReportIssuePage: React.FC = () => {
  const navigate = useNavigate();
  const { createComplaint, complaints, upvoteComplaint } = useComplaints();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  // Form State
  const [description, setDescription] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  // Analysis / Multi-stage flow State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<ComplaintAnalysisOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editable overrides before final submission
  const [finalCategory, setFinalCategory] = useState<StandardCategory>('Other');
  const [finalPriority, setFinalPriority] = useState<StandardPriority>('Medium');
  const [finalDepartment, setFinalDepartment] = useState('IT Support');

  const campusLocations = [
    'Computer Lab 1',
    'Computer Lab 2',
    'Main Library - 2nd Floor',
    'Hostel Block A - Floor 1',
    'Hostel Block B - Floor 2',
    'Hostel Block C - Room 312',
    'Science Block - Physics Lab',
    'Seminar Hall A',
    'Mechanical Workshop',
    'Central Cafeteria',
    'Administrative Block',
    'Other / Custom Location',
  ];

  const categories: StandardCategory[] = [
    'IT / Network',
    'Electrical',
    'Classroom Equipment',
    'Cleanliness',
    'Water / Plumbing',
    'Infrastructure',
    'Security',
    'Other',
  ];

  const priorities: StandardPriority[] = ['Low', 'Medium', 'High', 'Emergency'];

  const categoryDepartmentMap: Record<StandardCategory, string> = {
    'IT / Network': 'IT Support',
    'Electrical': 'Electrical Maintenance',
    'Classroom Equipment': 'Facility Management',
    'Cleanliness': 'Housekeeping',
    'Water / Plumbing': 'Plumbing',
    'Infrastructure': 'Facility Management',
    'Security': 'Security',
    'Other': 'Administration',
  };

  const stages = [
    'Understanding the problem',
    'Finding the location',
    'Identifying the issue type',
    'Checking priority',
    'Finding the right department',
  ];

  // Animated stages progression during AI analysis
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnalyzing) {
      setAnalysisStage(0);
      const interval = setInterval(() => {
        setAnalysisStage((prev) => {
          if (prev < stages.length - 1) return prev + 1;
          return prev;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please describe the problem', 'Add a short description of the issue', 'error');
      return;
    }

    const effectiveLocation =
      selectedLocation === 'Other / Custom Location' || !selectedLocation
        ? customLocation || currentUser.roomOrOffice || 'Campus Facility'
        : selectedLocation;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeComplaintWithLLM(
        { text: description, location: effectiveLocation },
        complaints
      );

      setAnalysisResult(result);
      setFinalCategory(result.category);
      setFinalPriority(result.priority);
      setFinalDepartment(result.department);
    } catch (err: any) {
      console.error('Analysis error:', err);
      showToast('Analysis complete', 'Ready for review', 'info');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!analysisResult) return;

    setIsSubmitting(true);

    try {
      const effectiveLocation =
        analysisResult.location ||
        (selectedLocation === 'Other / Custom Location' ? customLocation : selectedLocation) ||
        'Campus Facility';

      const newComplaint = await createComplaint({
        title: analysisResult.issue || 'Campus Maintenance Request',
        description: description.trim(),
        category: analysisResult.legacyCategory || 'other',
        standardCategory: finalCategory,
        priority: analysisResult.legacyPriority || 'medium',
        standardPriority: finalPriority,
        building: effectiveLocation.split('-')[0]?.trim() || effectiveLocation,
        roomNumber: effectiveLocation,
        room_number: effectiveLocation,
        location: effectiveLocation,
        assignedDepartmentId: analysisResult.departmentId || 'dept_facility_management',
        department_id: analysisResult.departmentId || 'dept_facility_management',
        assignedDepartmentName: finalDepartment || categoryDepartmentMap[finalCategory] || 'Campus Facility',
        student_id: currentUser?.id || 'usr_student_01',
        submittedBy: {
          id: currentUser?.id || 'usr_student_01',
          name: currentUser?.name || 'Alex Rivera',
          role: currentUser?.role || 'student',
          email: currentUser?.email || 'student@campus.edu',
        },
        attachments: attachedImage
          ? [
              {
                id: `att_${Date.now()}`,
                name: 'Attachment Photo',
                url: attachedImage,
                type: 'image' as const,
              },
            ]
          : [],
        aiAnalysis: {
          issue: analysisResult.issue,
          location: effectiveLocation,
          category: finalCategory,
          priority: finalPriority,
          department: finalDepartment,
          keywords: analysisResult.keywords,
          summary: analysisResult.summary,
          confidence: analysisResult.qualitativeConfidence,
          estimatedHours: analysisResult.estimatedHours,
          suggestedActions: analysisResult.suggestedActions,
        },
        is_demo: true,
      });

      showToast('Complaint Submitted', `Tracking #${newComplaint.trackingNumber || newComplaint.id}`, 'success');
      navigate(`/student/complaints/${newComplaint.id}`);
    } catch (err: any) {
      console.error('[REPORT_ISSUE_SUBMISSION_ERROR]', {
        status: err?.status,
        message: err?.message,
        data: err?.data,
        error: err,
      });
      showToast('Unable to submit your complaint right now.', 'Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4 animate-in fade-in" id="report-issue-page">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-theme-muted mb-1">
          <Link to="/student/dashboard" className="hover:text-theme-primary">Dashboard</Link>
          <span>/</span>
          <span className="text-theme-primary font-semibold">Report Issue</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-theme-primary">
          Report a Campus Problem
        </h1>
        <p className="text-xs sm:text-sm text-theme-secondary mt-1">
          Describe the problem in your own words and SmartFix AI will categorize and route it.
        </p>
      </div>

      {/* Main Reporting Form */}
      {!analysisResult && !isAnalyzing && (
        <form onSubmit={handleAnalyze} className="p-6 sm:p-8 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-6">
          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-primary">
              What is the problem? <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              placeholder="e.g. Lab 2 ka Wi-Fi nahi chal raha, or Projector in Room 204 keeps overheating."
              className="w-full p-4 rounded-xl border border-theme-subtle bg-surface-elevated text-sm text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
            />
          </div>

          {/* Location Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-theme-primary">
              Where is it located?
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-xs sm:text-sm text-theme-primary focus:outline-none focus:border-brand-primary"
              >
                <option value="">Select location or let AI detect</option>
                {campusLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {selectedLocation === 'Other / Custom Location' && (
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Enter specific room or area (e.g. C-Block 3rd Floor Water Cooler)"
                className="w-full px-4 py-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-brand-primary mt-2"
              />
            )}
          </div>

          {/* Optional Image Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-theme-muted">
              Add Photo (Optional)
            </label>
            {attachedImage ? (
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-theme-subtle group">
                <img
                  src={attachedImage}
                  alt="Attached preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-theme-subtle hover:border-brand-primary bg-surface-elevated/40 text-xs font-medium text-theme-secondary hover:text-theme-primary cursor-pointer transition-colors w-fit">
                <ImageIcon className="w-4 h-4 text-theme-muted" />
                <span>Upload photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="analyze-submit-btn"
              disabled={!description.trim()}
              className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze & Submit</span>
            </button>
          </div>
        </form>
      )}

      {/* AI Processing Screen */}
      {isAnalyzing && (
        <div className="p-8 sm:p-12 rounded-2xl border border-theme-subtle bg-surface shadow-sm text-center space-y-6 animate-in fade-in">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-theme-primary">
              Analyzing your complaint...
            </h3>
            <p className="text-xs text-theme-muted">
              SmartFix AI is processing your request details.
            </p>
          </div>

          {/* Simple step list without technical jargon */}
          <div className="max-w-xs mx-auto space-y-2.5 text-left pt-2">
            {stages.map((stage, idx) => {
              const isDone = idx <= analysisStage;
              return (
                <div
                  key={stage}
                  className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                    isDone ? 'text-theme-primary font-medium' : 'text-theme-muted opacity-40'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-surface-elevated border border-theme-subtle text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Analysis Result Display */}
      {analysisResult && !isAnalyzing && (
        <div className="p-6 sm:p-8 rounded-2xl border border-theme-subtle bg-surface shadow-sm space-y-6 animate-in fade-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-theme-subtle pb-4">
            <div>
              <h3 className="text-lg font-bold text-theme-primary">
                AI Analysis
              </h3>
              <p className="text-xs text-theme-muted">
                Review the automatically detected details below.
              </p>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-brand-primary/10 text-brand-primary">
              AI-assisted analysis
            </span>
          </div>

          {/* Extracted Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-surface-elevated border border-theme-subtle space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">
                Problem
              </span>
              <p className="text-xs sm:text-sm font-semibold text-theme-primary">
                {analysisResult.issue}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-elevated border border-theme-subtle space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">
                Location
              </span>
              <p className="text-xs sm:text-sm font-semibold text-theme-primary">
                {analysisResult.location}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-elevated border border-theme-subtle space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">
                Category
              </span>
              <p className="text-xs sm:text-sm font-semibold text-theme-primary">
                {finalCategory}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-elevated border border-theme-subtle space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">
                Priority
              </span>
              <span
                className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md ${
                  finalPriority === 'Emergency'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : finalPriority === 'High'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}
              >
                {finalPriority}
              </span>
            </div>

            <div className="sm:col-span-2 p-3.5 rounded-xl bg-surface-elevated border border-theme-subtle space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">
                Department
              </span>
              <p className="text-xs sm:text-sm font-semibold text-theme-primary flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-brand-primary" />
                {finalDepartment}
              </p>
            </div>

            {analysisResult.summary && (
              <div className="sm:col-span-2 p-3.5 rounded-xl bg-surface-elevated border border-theme-subtle space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-theme-muted">
                  Summary
                </span>
                <p className="text-xs text-theme-secondary leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>
            )}
          </div>

          {/* Similar Complaints Notice (if any) */}
          {analysisResult.similarityCandidates && analysisResult.similarityCandidates.length > 0 && (
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs space-y-2">
              <p className="font-semibold text-theme-primary flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-brand-primary" />
                Similar issues already reported nearby:
              </p>
              <div className="space-y-1.5">
                {analysisResult.similarityCandidates.slice(0, 2).map((sim) => (
                  <div
                    key={sim.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface border border-theme-subtle"
                  >
                    <span className="truncate max-w-[240px] text-theme-primary font-medium">
                      {sim.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        upvoteComplaint(sim.id);
                        showToast('Upvoted existing issue', 'Added your support to speed up resolution.', 'success');
                        navigate(`/student/complaints/${sim.id}`);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-brand-primary/10 text-brand-primary text-[11px] font-semibold hover:bg-brand-primary/20"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Upvote Existing</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAnalysisResult(null)}
              className="px-5 py-3 rounded-xl border border-theme-subtle bg-surface hover:bg-surface-hover text-xs font-semibold text-theme-secondary transition-colors"
            >
              Edit Description
            </button>
            <button
              type="button"
              id="confirm-submit-complaint-btn"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Complaint'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
