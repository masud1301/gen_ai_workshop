export type UserRole = 'student' | 'faculty' | 'staff' | 'admin';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type ComplaintStatus = 'submitted' | 'ai_classified' | 'assigned' | 'in_progress' | 'pending_verification' | 'resolved' | 'closed';

export type ComplaintStatusLabel = 'Submitted' | 'AI Analyzed' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

export type IssueCategory = 
  | 'hostel_maintenance'
  | 'it_network'
  | 'classroom_equipment'
  | 'campus_hygiene'
  | 'electrical_power'
  | 'plumbing_water'
  | 'cafeteria_food'
  | 'library_resources'
  | 'security_safety'
  | 'transport_parking';

export type StandardCategory = 
  | 'IT / Network'
  | 'Electrical'
  | 'Classroom Equipment'
  | 'Cleanliness'
  | 'Water / Plumbing'
  | 'Infrastructure'
  | 'Security'
  | 'Other';

export type StandardPriority = 'Low' | 'Medium' | 'High' | 'Emergency';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  avatarUrl?: string;
  status: 'active' | 'suspended' | 'inactive';
  created_at: string;
  createdAt?: string;
  updated_at?: string;
  studentId?: string;
  student_id?: string;
  roomOrOffice?: string;
  room_or_office?: string;
  phone?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  created_at: string;
  createdAt?: string;
  code?: string;
  category?: IssueCategory;
  headName?: string;
  headEmail?: string;
  contactEmail?: string;
  activeStaffCount?: number;
  openTicketsCount?: number;
  slaAvgHours?: number;
  avgResolutionHours?: number;
  slaComplianceRate?: number;
  slaTargetPercentage?: number;
  colorTheme?: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  building: string;
  code?: string;
  description: string;
  is_demo: boolean;
  created_at: string;
}

export interface ComplaintStatusHistory {
  id: string;
  complaint_id: string;
  status: string;
  note?: string;
  updated_by: string;
  created_at: string;
}

export interface AIAnalysisResult {
  detectedCategory: IssueCategory;
  confidenceScore: number; // e.g. 0.94
  extractedEntities: {
    location?: string;
    equipmentOrItem?: string;
    impactLevel?: string;
    urgencyReason?: string;
  };
  recommendedPriority: PriorityLevel;
  priorityRationale: string;
  recommendedDepartmentId: string;
  similarComplaintIds: string[];
  suggestedQuickActions: string[];
  estimatedResolutionHours: number;
}

export interface ActivityTimelineItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole | 'system_ai';
  title: string;
  description: string;
  statusChange?: ComplaintStatus;
  note?: string;
}

export interface ComplaintComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  avatarUrl?: string;
  createdAt: string;
  content: string;
  isInternalNote?: boolean;
}

export interface Complaint {
  id: string;
  student_id: string;
  original_message: string;
  issue: string;
  category: string;
  location: string;
  priority: string;
  department_id: string;
  assigned_staff_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
  is_demo: boolean;

  // Interop fields
  trackingNumber: string; // e.g. "SMART-2026-8812"
  title: string;
  description: string;
  building?: string;
  roomNumber?: string;
  
  submittedBy: {
    id: string;
    name: string;
    role: UserRole;
    email: string;
    roomOrOffice?: string;
    studentId?: string;
  };
  
  assignedDepartmentId: string;
  assignedDepartmentName: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  
  aiAnalysis?: AIAnalysisResult;
  timeline: ActivityTimelineItem[];
  comments: ComplaintComment[];
  
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'document';
  }[];
  
  duplicateCount?: number;
  upvotes?: number;
  upvotedBy?: string[];
  upvoted_by?: string[];
  userUpvoted?: boolean;
  satisfactionRating?: number; // 1-5
  satisfactionFeedback?: string;
}

export interface LostFoundItem {
  id: string;
  reported_by: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  location: string;
  date: string;
  status: 'active' | 'claimed' | 'matched';
  possible_match?: string;
  created_at: string;
  createdAt?: string;

  // Interop fields
  category?: string;
  contactInfo?: string;
  reportedByName?: string;
  imageUrl?: string;
  aiSuggestedMatchId?: string;
}

export interface CampusNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;

  // Interop fields
  priority?: 'normal' | 'urgent';
  createdAt?: string;
  relatedComplaintId?: string;
  link?: string;
}

export type ThemePreset = 'immersive-dark' | 'professional-light' | 'midnight' | 'aurora' | 'campus-green' | 'high-contrast';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface RecurringIssueCluster {
  id: string;
  category: IssueCategory;
  location: string;
  complaintCount: number;
  frequencyTrend: 'increasing' | 'stable' | 'decreasing';
  rootCauseHypothesis: string;
  recommendedAction: string;
  affectedStudentsEstimate: number;
}

