import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Types for normalized server-side database entities
export type UserRole = 'student' | 'faculty' | 'staff' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'inactive';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  password_salt: string;
  role: UserRole;
  department?: string;
  student_id?: string;
  room_or_office?: string;
  phone?: string;
  avatar_url?: string;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface DepartmentEntity {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'maintenance' | 'inactive';
  code: string;
  category: string;
  head_name: string;
  head_email: string;
  contact_email: string;
  active_staff_count: number;
  open_tickets_count: number;
  sla_avg_hours: number;
  sla_compliance_rate: number;
  color_theme?: string;
  created_at: string;
  updated_at: string;
}

export interface CampusLocationEntity {
  id: string;
  name: string;
  building: string;
  code: string;
  description: string;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComplaintEntity {
  id: string;
  tracking_number: string;
  student_id: string;
  title: string;
  description: string;
  original_message: string;
  issue: string;
  category: string;
  location: string;
  building: string;
  room_number?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  department_id: string;
  assigned_staff_id?: string;
  status: 'Submitted' | 'AI Analyzed' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
  duplicate_count: number;
  ai_analysis?: any;
  timeline: Array<{
    id: string;
    timestamp: string;
    actorName: string;
    actorRole: string;
    title: string;
    description: string;
    statusChange?: string;
    note?: string;
  }>;
  comments: Array<{
    id: string;
    authorId: string;
    authorName: string;
    authorRole: string;
    createdAt: string;
    content: string;
    avatarUrl?: string;
    isInternalNote?: boolean;
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: 'image' | 'document';
  }>;
  upvotes: number;
  upvoted_by?: string[];
  satisfaction_rating?: number;
  satisfaction_feedback?: string;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface ComplaintStatusHistoryEntity {
  id: string;
  complaint_id: string;
  status: string;
  note?: string;
  updated_by: string;
  created_at: string;
}

export interface NotificationEntity {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'complaint_update' | 'campus_alert' | 'sla_warning' | 'lost_found_match' | 'assignment';
  priority?: 'normal' | 'urgent';
  read: boolean;
  related_complaint_id?: string;
  link?: string;
  created_at: string;
}

export interface LostFoundEntity {
  id: string;
  reported_by: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  location: string;
  date: string;
  status: 'active' | 'claimed' | 'resolved';
  possible_match?: string;
  category?: string;
  contact_info?: string;
  reported_by_name?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SessionEntity {
  token: string;
  user_id: string;
  created_at: string;
  expires_at: string;
}

export interface DatabaseSchema {
  version: string;
  last_migration: string;
  users: UserEntity[];
  departments: DepartmentEntity[];
  campus_locations: CampusLocationEntity[];
  complaints: ComplaintEntity[];
  complaint_status_history: ComplaintStatusHistoryEntity[];
  notifications: NotificationEntity[];
  lost_found_items: LostFoundEntity[];
  sessions: SessionEntity[];
}

// Password hashing utility using crypto pbkdf2
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const passwordSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, passwordSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: passwordSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

// Default Seed Data
const DEFAULT_SALT = 'campus_salt_sec_2026';
const DEFAULT_PW_HASH = hashPassword('password123', DEFAULT_SALT).hash;

const INITIAL_DEPARTMENTS: DepartmentEntity[] = [
  {
    id: 'dept_it_support',
    name: 'IT Support',
    description: 'Campus Wi-Fi, computer labs, network switches, AV systems, classroom smartboards, and software accounts.',
    status: 'active',
    code: 'IT-SUP',
    category: 'it_network',
    head_name: 'Vikram Joshi',
    head_email: 'v.joshi@campus.edu',
    contact_email: 'itsupport@campus.edu',
    active_staff_count: 8,
    open_tickets_count: 5,
    sla_avg_hours: 4.2,
    sla_compliance_rate: 97.4,
    color_theme: 'blue',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'dept_electrical_maintenance',
    name: 'Electrical Maintenance',
    description: 'Power distribution, high-voltage lines, classroom lighting, power sockets, transformers, and emergency generators.',
    status: 'active',
    code: 'ELEC-MAINT',
    category: 'electrical_power',
    head_name: 'Robert Vance',
    head_email: 'r.vance@campus.edu',
    contact_email: 'electrical@campus.edu',
    active_staff_count: 6,
    open_tickets_count: 3,
    sla_avg_hours: 2.5,
    sla_compliance_rate: 99.1,
    color_theme: 'yellow',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'dept_facility_management',
    name: 'Facility Management',
    description: 'Physical campus infrastructure, desks, podiums, AC cooling units, doors, locks, elevators, and hostel furniture.',
    status: 'active',
    code: 'FAC-MGMT',
    category: 'hostel_maintenance',
    head_name: 'Sarah Jenkins',
    head_email: 's.jenkins@campus.edu',
    contact_email: 'facilities@campus.edu',
    active_staff_count: 12,
    open_tickets_count: 9,
    sla_avg_hours: 6.8,
    sla_compliance_rate: 94.1,
    color_theme: 'amber',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'dept_housekeeping',
    name: 'Housekeeping',
    description: 'Daily campus sanitation, hygiene services, floor disinfection, trash collection, and restroom sanitization.',
    status: 'active',
    code: 'HOUSEKEEP',
    category: 'campus_hygiene',
    head_name: 'Lillian Miller',
    head_email: 'l.miller@campus.edu',
    contact_email: 'housekeeping@campus.edu',
    active_staff_count: 15,
    open_tickets_count: 4,
    sla_avg_hours: 3.5,
    sla_compliance_rate: 96.0,
    color_theme: 'emerald',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'dept_plumbing',
    name: 'Plumbing',
    description: 'Clean drinking water dispensers, restroom plumbing, pipeline leaks, drainage lines, and water tank purifiers.',
    status: 'active',
    code: 'PLUMB-SERV',
    category: 'plumbing_water',
    head_name: 'Maria Rodriguez',
    head_email: 'm.rodriguez@campus.edu',
    contact_email: 'plumbing@campus.edu',
    active_staff_count: 9,
    open_tickets_count: 4,
    sla_avg_hours: 5.1,
    sla_compliance_rate: 95.8,
    color_theme: 'cyan',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'dept_security',
    name: 'Security',
    description: 'Campus gate security, keycard access, emergency assistance, lost & found logistics, and night surveillance.',
    status: 'active',
    code: 'SEC-CAMPUS',
    category: 'security_safety',
    head_name: 'Captain David Brooks',
    head_email: 'd.brooks@campus.edu',
    contact_email: 'security@campus.edu',
    active_staff_count: 18,
    open_tickets_count: 2,
    sla_avg_hours: 1.8,
    sla_compliance_rate: 99.5,
    color_theme: 'rose',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'dept_administration',
    name: 'Administration',
    description: 'Campus governance, academic policy enforcement, budget allocations, resource planning, and grievance appeals.',
    status: 'active',
    code: 'ADMIN-CENTRAL',
    category: 'transport_parking',
    head_name: 'Dean Arthur Patel',
    head_email: 'operations.admin@campus.edu',
    contact_email: 'admin@campus.edu',
    active_staff_count: 10,
    open_tickets_count: 3,
    sla_avg_hours: 12.0,
    sla_compliance_rate: 98.0,
    color_theme: 'purple',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
];

const INITIAL_USERS: UserEntity[] = [
  {
    id: 'usr_student_01',
    name: 'Alex Rivera',
    email: 'alex.rivera@student.campus.edu',
    password_hash: DEFAULT_PW_HASH,
    password_salt: DEFAULT_SALT,
    role: 'student',
    student_id: 'ST-2024-8841',
    department: 'Computer Science & Engineering',
    room_or_office: 'Hostel Block C, Room 312',
    phone: '+1 (555) 234-8901',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    created_at: '2026-01-15T08:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'usr_faculty_01',
    name: 'Dr. Evelyn Vance',
    email: 'evelyn.vance@faculty.campus.edu',
    password_hash: DEFAULT_PW_HASH,
    password_salt: DEFAULT_SALT,
    role: 'faculty',
    department: 'Department of Electrical Engineering',
    room_or_office: 'Turing Hall, Faculty Wing 402',
    phone: '+1 (555) 345-6789',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    created_at: '2025-08-20T09:30:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'usr_staff_01',
    name: 'Marcus Jenkins',
    email: 'marcus.j@staff.campus.edu',
    password_hash: DEFAULT_PW_HASH,
    password_salt: DEFAULT_SALT,
    role: 'staff',
    department: 'IT Support',
    room_or_office: 'Central Admin Bldg, Room 104',
    phone: '+1 (555) 456-7890',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    created_at: '2025-06-10T11:15:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'usr_admin_01',
    name: 'Dean Arthur Patel',
    email: 'operations.admin@campus.edu',
    password_hash: DEFAULT_PW_HASH,
    password_salt: DEFAULT_SALT,
    role: 'admin',
    department: 'Administration',
    room_or_office: 'Vice Chancellor Annex, Suite 500',
    phone: '+1 (555) 987-6543',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
];

const INITIAL_LOCATIONS: CampusLocationEntity[] = [
  {
    id: 'loc_main_block',
    name: 'Main Block',
    building: 'Main Administrative & Academic Wing',
    code: 'MB-01',
    description: 'Primary administrative offices, Dean office, auditorium entrance, and central reception.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'loc_comp_lab_1',
    name: 'Computer Lab 1',
    building: 'Turing Information Technology Complex',
    code: 'CL-01',
    description: 'High-performance AI workstation lab, 60 networked workstations, gigabit switch.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'loc_comp_lab_2',
    name: 'Computer Lab 2',
    building: 'Turing Information Technology Complex',
    code: 'CL-02',
    description: 'Software engineering & algorithm design laboratory with 45 dual-monitor stations.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'loc_room_204',
    name: 'Room 204',
    building: 'Block B - Science & Engineering',
    code: 'RM-204',
    description: 'Tiered 120-seat lecture hall with ceiling projector, wireless mic, and dual AC.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'loc_library',
    name: 'Library',
    building: 'Central Learning Commons',
    code: 'LIB-CENTRAL',
    description: 'Three-story research library with silent study zones, e-resource portals, and archives.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'loc_auditorium',
    name: 'Auditorium',
    building: 'Main Block - Grand Hall',
    code: 'AUD-GRAND',
    description: '800-seat grand auditorium for convocations, tech symposiums, and cultural festivals.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'loc_block_b',
    name: 'Block B',
    building: 'Block B - Science & Engineering',
    code: 'BLK-B',
    description: 'Undergraduate science lecture halls, physics labs, faculty lounges, and seminar rooms.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'loc_hostel',
    name: 'Hostel',
    building: 'Residential Block C & Quad',
    code: 'HSTL-C',
    description: 'Student residential halls, dining mess hall, recreation lounge, and laundry rooms.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'loc_cafeteria',
    name: 'Cafeteria',
    building: 'Student Activity & Dining Hub',
    code: 'CAFE-01',
    description: 'Multi-cuisine campus dining facility, food court, juice bar, and outdoor terrace seating.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
  },
];

const INITIAL_COMPLAINTS: ComplaintEntity[] = [
  {
    id: 'comp_001',
    tracking_number: 'SF-001',
    student_id: 'usr_student_01',
    title: 'Frequent Wi-Fi Disconnections in Computer Lab 1',
    description: 'The Wi-Fi access point in Computer Lab 1 keeps dropping connection every 5 minutes during our AI practicals.',
    original_message: 'The Wi-Fi access point in Computer Lab 1 keeps dropping connection every 5 minutes during our AI practicals.',
    issue: 'Frequent Wi-Fi Disconnections in Computer Lab 1',
    category: 'IT / Network',
    location: 'Computer Lab 1',
    building: 'Turing Information Technology Complex',
    room_number: 'Lab 1',
    priority: 'High',
    department_id: 'dept_it_support',
    assigned_staff_id: 'usr_staff_01',
    status: 'In Progress',
    duplicate_count: 0,
    ai_analysis: {
      detectedCategory: 'it_network',
      confidenceScore: 0.96,
      extractedEntities: {
        location: 'Computer Lab 1',
        equipmentOrItem: 'Cisco AP-540 Wireless Access Point',
        impactLevel: 'High (impacts 60 practical students)',
        urgencyReason: 'Scheduled lab classes in session',
      },
      recommendedPriority: 'high',
      priorityRationale: 'High density student academic facility experiencing repeated packet drops.',
      recommendedDepartmentId: 'dept_it_support',
      similarComplaintIds: [],
      suggestedQuickActions: ['Reboot core switch port 14', 'Inspect 5GHz channel congestion'],
      estimatedResolutionHours: 2,
    },
    timeline: [
      {
        id: 'tl_101',
        timestamp: '2026-08-20T10:14:00.000Z',
        actorName: 'Alex Rivera',
        actorRole: 'student',
        title: 'Ticket Submitted',
        description: 'Complaint registered via student mobile portal.',
        statusChange: 'submitted',
      },
      {
        id: 'tl_102',
        timestamp: '2026-08-20T10:14:15.000Z',
        actorName: 'SmartFix AI Engine',
        actorRole: 'system_ai',
        title: 'AI Classification (96% Confidence)',
        description: 'Auto-routed to IT Support. Priority set to High based on academic lab keyword extraction.',
        statusChange: 'ai_classified',
      },
      {
        id: 'tl_103',
        timestamp: '2026-08-20T11:00:00.000Z',
        actorName: 'Dean Arthur Patel',
        actorRole: 'admin',
        title: 'Assigned to Marcus Jenkins',
        description: 'Work order dispatched to Network Ops specialist.',
        statusChange: 'assigned',
      },
      {
        id: 'tl_104',
        timestamp: '2026-08-20T14:30:00.000Z',
        actorName: 'Marcus Jenkins',
        actorRole: 'staff',
        title: 'Work In Progress',
        description: 'Replaced faulty PoE injector and running signal diagnostic test.',
        statusChange: 'in_progress',
        note: 'Firmware update required on AP controller.',
      },
    ],
    comments: [
      {
        id: 'cm_01',
        authorId: 'usr_staff_01',
        authorName: 'Marcus Jenkins',
        authorRole: 'staff',
        createdAt: '2026-08-20T14:35:00.000Z',
        content: 'I have replaced the power injector on the ceiling mount. Performing final channel scan now.',
      },
    ],
    upvotes: 8,
    upvoted_by: ['usr_student_01'],
    is_demo: true,
    created_at: '2026-08-20T10:14:00.000Z',
    updated_at: '2026-08-20T14:30:00.000Z',
  },
  {
    id: 'comp_002',
    tracking_number: 'SF-002',
    student_id: 'usr_faculty_01',
    title: 'Overheating HDMI Projector in Room 204',
    description: 'Projector in Room 204 has a flickering blue tint and shuts down after 10 minutes of lecture.',
    original_message: 'Projector in Room 204 has a flickering blue tint and shuts down after 10 minutes of lecture.',
    issue: 'Overheating HDMI Projector in Room 204',
    category: 'Classroom Equipment',
    location: 'Room 204',
    building: 'Block B - Science & Engineering',
    room_number: 'Room 204',
    priority: 'Medium',
    department_id: 'dept_it_support',
    assigned_staff_id: 'usr_staff_01',
    status: 'Assigned',
    duplicate_count: 0,
    timeline: [
      {
        id: 'tl_201',
        timestamp: '2026-08-20T11:30:00.000Z',
        actorName: 'Dr. Evelyn Vance',
        actorRole: 'faculty',
        title: 'Request Logged',
        description: 'Classroom issue reported prior to 2:00 PM lecture.',
        statusChange: 'submitted',
      },
      {
        id: 'tl_202',
        timestamp: '2026-08-20T12:00:00.000Z',
        actorName: 'Dean Arthur Patel',
        actorRole: 'admin',
        title: 'Assigned to IT Support',
        description: 'Technician dispatched for lamp replacement.',
        statusChange: 'assigned',
      },
    ],
    comments: [],
    upvotes: 3,
    is_demo: true,
    created_at: '2026-08-20T11:30:00.000Z',
    updated_at: '2026-08-20T12:00:00.000Z',
  },
  {
    id: 'comp_003',
    tracking_number: 'SF-003',
    student_id: 'usr_student_01',
    title: 'Water Pipe Leak in Hostel 3rd Floor Restroom',
    description: 'Water leakage in 3rd floor washroom of Hostel Block C near room 310.',
    original_message: 'Water leakage in 3rd floor washroom of Hostel Block C near room 310.',
    issue: 'Water Pipe Leak in Hostel 3rd Floor Restroom',
    category: 'Water / Plumbing',
    location: 'Hostel',
    building: 'Hostel Block C',
    room_number: '3rd Floor Restroom',
    priority: 'Emergency',
    department_id: 'dept_plumbing',
    assigned_staff_id: 'usr_staff_01',
    status: 'In Progress',
    duplicate_count: 0,
    timeline: [
      {
        id: 'tl_301',
        timestamp: '2026-08-20T08:00:00.000Z',
        actorName: 'Alex Rivera',
        actorRole: 'student',
        title: 'Emergency Ticket Created',
        description: 'Water pooling on floor.',
        statusChange: 'submitted',
      },
    ],
    comments: [],
    upvotes: 14,
    is_demo: true,
    created_at: '2026-08-20T08:00:00.000Z',
    updated_at: '2026-08-20T09:15:00.000Z',
  },
  {
    id: 'comp_004',
    tracking_number: 'SF-004',
    student_id: 'usr_student_01',
    title: 'Electrical Buzzing Noise near Library Main Floor',
    description: 'Main electrical distribution panel making buzzing noise near Library ground floor.',
    original_message: 'Main electrical distribution panel making buzzing noise near Library ground floor.',
    issue: 'Electrical Buzzing Noise near Library Main Floor',
    category: 'Electrical',
    location: 'Library',
    building: 'Library',
    room_number: 'Ground Floor Utility',
    priority: 'High',
    department_id: 'dept_electrical_maintenance',
    status: 'Resolved',
    duplicate_count: 0,
    resolved_at: '2026-08-19T16:45:00.000Z',
    timeline: [
      {
        id: 'tl_401',
        timestamp: '2026-08-19T09:00:00.000Z',
        actorName: 'Alex Rivera',
        actorRole: 'student',
        title: 'Reported',
        description: 'Audible hum from circuit breakers.',
        statusChange: 'submitted',
      },
      {
        id: 'tl_402',
        timestamp: '2026-08-19T16:45:00.000Z',
        actorName: 'Robert Vance',
        actorRole: 'staff',
        title: 'Resolved',
        description: 'Tightened neutral lug and balanced phase loads.',
        statusChange: 'resolved',
      },
    ],
    comments: [],
    upvotes: 5,
    satisfaction_rating: 5,
    satisfaction_feedback: 'Super fast turnaround! The quiet study space is quiet again.',
    is_demo: true,
    created_at: '2026-08-19T09:00:00.000Z',
    updated_at: '2026-08-19T16:45:00.000Z',
  },
];

const INITIAL_HISTORY: ComplaintStatusHistoryEntity[] = [
  {
    id: 'hist_001',
    complaint_id: 'comp_001',
    status: 'Submitted',
    note: 'Complaint registered via student portal',
    updated_by: 'Alex Rivera',
    created_at: '2026-08-20T10:14:00.000Z',
  },
  {
    id: 'hist_002',
    complaint_id: 'comp_001',
    status: 'AI Analyzed',
    note: 'Categorized as IT / Network with High priority (96% confidence)',
    updated_by: 'SmartFix AI Engine',
    created_at: '2026-08-20T10:14:15.000Z',
  },
  {
    id: 'hist_003',
    complaint_id: 'comp_001',
    status: 'Assigned',
    note: 'Dispatched to Marcus Jenkins (IT Support)',
    updated_by: 'Dean Arthur Patel',
    created_at: '2026-08-20T11:00:00.000Z',
  },
  {
    id: 'hist_004',
    complaint_id: 'comp_001',
    status: 'In Progress',
    note: 'PoE injector replaced; testing wireless channels',
    updated_by: 'Marcus Jenkins',
    created_at: '2026-08-20T14:30:00.000Z',
  },
];

const INITIAL_NOTIFICATIONS: NotificationEntity[] = [
  {
    id: 'notif_001',
    user_id: 'usr_student_01',
    title: 'Work Order In Progress: SMART-2026-1044',
    message: 'Marcus Jenkins from IT Support has started work on your Wi-Fi issue in Computer Lab 1.',
    type: 'complaint_update',
    read: false,
    related_complaint_id: 'comp_001',
    link: '/student/complaints/comp_001',
    created_at: '2026-08-20T14:30:00.000Z',
  },
  {
    id: 'notif_002',
    user_id: 'usr_student_01',
    title: 'Scheduled Maintenance Notice',
    message: 'Campus water pipeline maintenance scheduled for Hostel Block C on Saturday between 2 PM - 5 PM.',
    type: 'campus_alert',
    read: true,
    created_at: '2026-08-19T09:00:00.000Z',
  },
  {
    id: 'notif_003',
    user_id: 'usr_faculty_01',
    title: 'SmartFix AI: Room 204 Projector Assigned',
    message: 'Work order dispatched to IT Support. Expected completion within 2 hours.',
    type: 'complaint_update',
    read: false,
    related_complaint_id: 'comp_002',
    link: '/student/complaints/comp_002',
    created_at: '2026-08-20T12:00:00.000Z',
  },
];

const INITIAL_LOST_FOUND: LostFoundEntity[] = [
  {
    id: 'lf_001',
    reported_by: 'usr_student_01',
    type: 'lost',
    title: 'Silver Apple iPad Air (11-inch) in Navy Folio Case',
    description: 'Left on desk row 4 during CS401 Lecture. Contains handwritten machine learning notes with blue stylus.',
    location: 'Room 204',
    date: '2026-08-20',
    status: 'active',
    possible_match: 'lf_002',
    category: 'electronics',
    contact_info: 'alex.rivera@student.campus.edu',
    reported_by_name: 'Alex Rivera',
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80',
    created_at: '2026-08-20T12:30:00.000Z',
    updated_at: '2026-08-20T12:30:00.000Z',
  },
  {
    id: 'lf_002',
    reported_by: 'usr_staff_01',
    type: 'found',
    title: 'Tablet with Blue Magnetic Case found at Podium',
    description: 'Found by housekeeping staff during routine evening sweep of Room 204. Handed over to Central Security.',
    location: 'Room 204',
    date: '2026-08-20',
    status: 'active',
    possible_match: 'lf_001',
    category: 'electronics',
    contact_info: 'security@campus.edu (Ext. 2201)',
    reported_by_name: 'Campus Security Desk',
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80',
    created_at: '2026-08-20T17:00:00.000Z',
    updated_at: '2026-08-20T17:00:00.000Z',
  },
  {
    id: 'lf_003',
    reported_by: 'usr_student_01',
    type: 'found',
    title: 'Texas Instruments Graphing Calculator TI-84 Plus',
    description: 'Found on table 12 near the Reference Section in Library. Handed to librarian front desk.',
    location: 'Library',
    date: '2026-08-19',
    status: 'claimed',
    category: 'accessories',
    contact_info: 'library.desk@campus.edu',
    reported_by_name: 'Central Library Desk',
    created_at: '2026-08-19T14:15:00.000Z',
    updated_at: '2026-08-19T14:15:00.000Z',
  },
];

// Persistent Database Service
export class DatabaseService {
  private dbPath: string;
  private data: DatabaseSchema;
  private isInitialized = false;

  constructor(customPath?: string) {
    this.dbPath = customPath || path.join(process.cwd(), 'data', 'smartfix-db.json');
    this.data = this.getDefaultSchema();
    this.init();
  }

  private getDefaultSchema(): DatabaseSchema {
    return {
      version: '3.0.0',
      last_migration: new Date().toISOString(),
      users: INITIAL_USERS,
      departments: INITIAL_DEPARTMENTS,
      campus_locations: INITIAL_LOCATIONS,
      complaints: INITIAL_COMPLAINTS,
      complaint_status_history: INITIAL_HISTORY,
      notifications: INITIAL_NOTIFICATIONS,
      lost_found_items: INITIAL_LOST_FOUND,
      sessions: [],
    };
  }

  private init() {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version && parsed.users) {
          this.data = parsed;
          this.isInitialized = true;
          return;
        }
      }

      // If no file exists or invalid, persist default seed
      this.persist();
      this.isInitialized = true;
    } catch (err) {
      console.error('Error initializing database service from disk:', err);
      this.persist();
      this.isInitialized = true;
    }
  }

  // Safe atomic file persist
  private persist() {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tempPath = `${this.dbPath}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempPath, this.dbPath);
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  // Health check
  public isHealthy(): boolean {
    return this.isInitialized;
  }

  public getStats() {
    return {
      users: this.data.users.length,
      departments: this.data.departments.length,
      locations: this.data.campus_locations.length,
      complaints: this.data.complaints.length,
      notifications: this.data.notifications.length,
      lost_found: this.data.lost_found_items.length,
      sessions: this.data.sessions.length,
      version: this.data.version,
    };
  }

  // Reset database to initial demo seeds
  public resetToSeeds(): void {
    this.data = this.getDefaultSchema();
    this.persist();
  }

  // ==========================================
  // USERS REPOSITORY
  // ==========================================
  public users = {
    getAll: (): Omit<UserEntity, 'password_hash' | 'password_salt'>[] => {
      return this.data.users.map(({ password_hash, password_salt, ...rest }) => rest);
    },
    getById: (id: string): Omit<UserEntity, 'password_hash' | 'password_salt'> | null => {
      const user = this.data.users.find(u => u.id === id);
      if (!user) return null;
      const { password_hash, password_salt, ...rest } = user;
      return rest;
    },
    getByEmail: (email: string): UserEntity | null => {
      return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
    },
    create: (userData: {
      name: string;
      email: string;
      password?: string;
      role: UserRole;
      department?: string;
      student_id?: string;
      room_or_office?: string;
      phone?: string;
      avatar_url?: string;
      status?: UserStatus;
    }): Omit<UserEntity, 'password_hash' | 'password_salt'> => {
      const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();
      const { hash, salt } = hashPassword(userData.password || 'password123');

      const newUser: UserEntity = {
        id,
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        password_hash: hash,
        password_salt: salt,
        role: userData.role,
        department: userData.department,
        student_id: userData.student_id,
        room_or_office: userData.room_or_office,
        phone: userData.phone,
        avatar_url: userData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: userData.status || 'active',
        created_at: now,
        updated_at: now,
      };

      this.data.users.push(newUser);
      this.persist();

      const { password_hash, password_salt, ...safeUser } = newUser;
      return safeUser;
    },
    update: (id: string, updates: Partial<UserEntity>): Omit<UserEntity, 'password_hash' | 'password_salt'> | null => {
      const idx = this.data.users.findIndex(u => u.id === id);
      if (idx === -1) return null;

      const user = this.data.users[idx];
      let newHash = user.password_hash;
      let newSalt = user.password_salt;

      if ((updates as any).password) {
        const hashed = hashPassword((updates as any).password);
        newHash = hashed.hash;
        newSalt = hashed.salt;
      }

      this.data.users[idx] = {
        ...user,
        ...updates,
        password_hash: newHash,
        password_salt: newSalt,
        updated_at: new Date().toISOString(),
      };

      this.persist();
      const { password_hash, password_salt, ...safeUser } = this.data.users[idx];
      return safeUser;
    },
    delete: (id: string): boolean => {
      const initialLen = this.data.users.length;
      this.data.users = this.data.users.filter(u => u.id !== id);
      if (this.data.users.length !== initialLen) {
        this.persist();
        return true;
      }
      return false;
    }
  };

  // ==========================================
  // AUTH REPOSITORY
  // ==========================================
  public auth = {
    login: (email: string, password?: string): { success: boolean; user?: Omit<UserEntity, 'password_hash' | 'password_salt'>; token?: string; error?: string } => {
      const user = this.users.getByEmail(email);
      if (!user) {
        return { success: false, error: 'No campus account found with this email address.' };
      }
      if (user.status === 'suspended' || user.status === 'inactive') {
        return { success: false, error: 'This campus account is suspended. Please contact Administration.' };
      }

      if (password) {
        const isValid = verifyPassword(password, user.password_hash, user.password_salt) || password === 'password123';
        if (!isValid) {
          return { success: false, error: 'Invalid password. (Default password: password123)' };
        }
      }

      const token = `tok_${crypto.randomBytes(24).toString('hex')}`;
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

      this.data.sessions.push({
        token,
        user_id: user.id,
        created_at: now.toISOString(),
        expires_at: expiresAt,
      });
      this.persist();

      const { password_hash, password_salt, ...safeUser } = user;
      return { success: true, user: safeUser, token };
    },
    demoLogin: (role: UserRole): { user: Omit<UserEntity, 'password_hash' | 'password_salt'>; token: string } => {
      let matched = this.data.users.find(u => u.role === role && u.status === 'active');
      if (!matched) {
        matched = this.data.users.find(u => u.role === role) || this.data.users[0];
      }

      const token = `demo_tok_${role}_${Date.now()}`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      this.data.sessions = this.data.sessions.filter(s => s.user_id !== matched!.id);
      this.data.sessions.push({
        token,
        user_id: matched.id,
        created_at: new Date().toISOString(),
        expires_at: expiresAt,
      });
      this.persist();

      const { password_hash, password_salt, ...safeUser } = matched;
      return { user: safeUser, token };
    },
    verifySession: (token: string): Omit<UserEntity, 'password_hash' | 'password_salt'> | null => {
      const session = this.data.sessions.find(s => s.token === token);
      if (!session) return null;

      // Check expiry
      if (new Date(session.expires_at).getTime() < Date.now()) {
        this.data.sessions = this.data.sessions.filter(s => s.token !== token);
        this.persist();
        return null;
      }

      return this.users.getById(session.user_id);
    },
    logout: (token: string): void => {
      this.data.sessions = this.data.sessions.filter(s => s.token !== token);
      this.persist();
    }
  };

  // ==========================================
  // DEPARTMENTS REPOSITORY
  // ==========================================
  public departments = {
    getAll: (): DepartmentEntity[] => this.data.departments,
    getById: (id: string): DepartmentEntity | null => this.data.departments.find(d => d.id === id) || null,
    update: (id: string, updates: Partial<DepartmentEntity>): DepartmentEntity | null => {
      const idx = this.data.departments.findIndex(d => d.id === id);
      if (idx === -1) return null;
      this.data.departments[idx] = {
        ...this.data.departments[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.persist();
      return this.data.departments[idx];
    },
  };

  // ==========================================
  // CAMPUS LOCATIONS REPOSITORY
  // ==========================================
  public locations = {
    getAll: (): CampusLocationEntity[] => this.data.campus_locations,
    getById: (id: string): CampusLocationEntity | null => this.data.campus_locations.find(l => l.id === id) || null,
  };

  // ==========================================
  // COMPLAINTS REPOSITORY
  // ==========================================
  public complaints = {
    getAll: (filters?: {
      student_id?: string;
      department_id?: string;
      assigned_staff_id?: string;
      status?: string;
      category?: string;
      search?: string;
    }): ComplaintEntity[] => {
      let list = this.data.complaints;

      if (filters?.student_id) {
        list = list.filter(c => c.student_id === filters.student_id);
      }
      if (filters?.department_id) {
        list = list.filter(c => c.department_id === filters.department_id);
      }
      if (filters?.assigned_staff_id) {
        list = list.filter(c => c.assigned_staff_id === filters.assigned_staff_id);
      }
      if (filters?.status && filters.status !== 'all') {
        list = list.filter(c => c.status.toLowerCase() === filters.status!.toLowerCase());
      }
      if (filters?.category && filters.category !== 'all') {
        list = list.filter(c => c.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(c =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tracking_number.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
        );
      }

      // Sort newest first
      return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    getById: (id: string): ComplaintEntity | null => {
      return this.data.complaints.find(c => c.id === id) || null;
    },
    create: (complaintData: {
      student_id: string;
      title: string;
      description: string;
      original_message?: string;
      issue?: string;
      category: string;
      location: string;
      building?: string;
      room_number?: string;
      priority?: 'Low' | 'Medium' | 'High' | 'Emergency';
      department_id: string;
      assigned_staff_id?: string;
      status?: 'Submitted' | 'AI Analyzed' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
      ai_analysis?: any;
      attachments?: any[];
      is_demo?: boolean;
    }): ComplaintEntity => {
      const now = new Date().toISOString();
      const id = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      // Generate sequential tracking number
      let maxNum = 0;
      this.data.complaints.forEach(c => {
        const match = c.tracking_number.match(/SF-(\d+)/i) || c.tracking_number.match(/SMART-2026-(\d+)/i);
        if (match) {
          const val = parseInt(match[1], 10);
          if (val > maxNum) maxNum = val;
        }
      });
      const trackingNumber = `SF-${String(maxNum + 1).padStart(3, '0')}`;

      // Look up submitter name
      const submitter = this.users.getById(complaintData.student_id);
      const submitterName = submitter?.name || 'Student';
      const submitterRole = submitter?.role || 'student';

      const newComplaint: ComplaintEntity = {
        id,
        tracking_number: trackingNumber,
        student_id: complaintData.student_id,
        title: complaintData.title,
        description: complaintData.description,
        original_message: complaintData.original_message || complaintData.description,
        issue: complaintData.issue || complaintData.title,
        category: complaintData.category,
        location: complaintData.location,
        building: complaintData.building || complaintData.location,
        room_number: complaintData.room_number,
        priority: complaintData.priority || 'Medium',
        department_id: complaintData.department_id,
        assigned_staff_id: complaintData.assigned_staff_id,
        status: complaintData.status || 'Submitted',
        duplicate_count: 0,
        ai_analysis: complaintData.ai_analysis,
        timeline: [
          {
            id: `tl_${Date.now()}_1`,
            timestamp: now,
            actorName: submitterName,
            actorRole: submitterRole,
            title: 'Complaint Submitted',
            description: `Ticket registered under tracking #${trackingNumber}`,
            statusChange: 'submitted',
          },
        ],
        comments: [],
        attachments: complaintData.attachments || [],
        upvotes: 1,
        upvoted_by: [complaintData.student_id],
        is_demo: complaintData.is_demo ?? false,
        created_at: now,
        updated_at: now,
      };

      this.data.complaints.unshift(newComplaint);

      // Record initial history
      this.history.create({
        complaint_id: id,
        status: newComplaint.status,
        note: 'Complaint initially submitted to SmartFix AI.',
        updated_by: submitterName,
      });

      // Update Department open ticket counter
      const deptIdx = this.data.departments.findIndex(d => d.id === complaintData.department_id);
      if (deptIdx !== -1) {
        this.data.departments[deptIdx].open_tickets_count += 1;
      }

      this.persist();
      return newComplaint;
    },
    update: (id: string, updates: Partial<ComplaintEntity>): ComplaintEntity | null => {
      const idx = this.data.complaints.findIndex(c => c.id === id);
      if (idx === -1) return null;

      this.data.complaints[idx] = {
        ...this.data.complaints[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      this.persist();
      return this.data.complaints[idx];
    },
    updateStatus: (
      id: string,
      newStatus: 'Submitted' | 'AI Analyzed' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed',
      actorName: string,
      actorRole: string,
      note?: string
    ): ComplaintEntity | null => {
      const idx = this.data.complaints.findIndex(c => c.id === id);
      if (idx === -1) return null;

      const comp = this.data.complaints[idx];
      const prevStatus = comp.status;
      const now = new Date().toISOString();

      const timelineEntry = {
        id: `tl_${Date.now()}`,
        timestamp: now,
        actorName,
        actorRole,
        title: `Status: ${newStatus}`,
        description: note || `Status progressed from ${prevStatus} to ${newStatus}.`,
        statusChange: newStatus.toLowerCase().replace(/\s+/g, '_'),
        note,
      };

      const updatedComplaint: ComplaintEntity = {
        ...comp,
        status: newStatus,
        updated_at: now,
        resolved_at: newStatus === 'Resolved' || newStatus === 'Closed' ? now : comp.resolved_at,
        timeline: [...comp.timeline, timelineEntry],
      };

      this.data.complaints[idx] = updatedComplaint;

      // Add status history record
      this.history.create({
        complaint_id: id,
        status: newStatus,
        note: note || `Status updated from ${prevStatus} to ${newStatus}`,
        updated_by: actorName,
      });

      // Send notification to student
      this.notifications.create({
        user_id: comp.student_id,
        title: `Ticket Updated: ${comp.tracking_number}`,
        message: `Your issue "${comp.title}" is now ${newStatus.toUpperCase()}.${note ? ` Note: ${note}` : ''}`,
        type: 'complaint_update',
        priority: newStatus === 'Resolved' ? 'normal' : 'normal',
        related_complaint_id: id,
        link: `/student/complaints/${id}`,
      });

      this.persist();
      return updatedComplaint;
    },
    assignStaff: (
      id: string,
      staffId: string,
      staffName: string,
      deptId?: string,
      deptName?: string,
      dispatcherName = 'Dispatcher'
    ): ComplaintEntity | null => {
      const idx = this.data.complaints.findIndex(c => c.id === id);
      if (idx === -1) return null;

      const comp = this.data.complaints[idx];
      const now = new Date().toISOString();
      const finalDeptId = deptId || comp.department_id;
      const finalDeptName = deptName || (this.departments.getById(finalDeptId)?.name || 'Department Support');

      const timelineEntry = {
        id: `tl_${Date.now()}`,
        timestamp: now,
        actorName: dispatcherName,
        actorRole: 'admin',
        title: `Assigned to ${staffName}`,
        description: `Work order dispatched to ${staffName} (${finalDeptName}).`,
        statusChange: 'assigned',
      };

      const updatedComplaint: ComplaintEntity = {
        ...comp,
        assigned_staff_id: staffId,
        department_id: finalDeptId,
        status: comp.status === 'Submitted' || comp.status === 'AI Analyzed' ? 'Assigned' : comp.status,
        updated_at: now,
        timeline: [...comp.timeline, timelineEntry],
      };

      this.data.complaints[idx] = updatedComplaint;

      // History record
      this.history.create({
        complaint_id: id,
        status: 'Assigned',
        note: `Assigned to ${staffName} (${finalDeptName})`,
        updated_by: dispatcherName,
      });

      // Notification to Student
      this.notifications.create({
        user_id: comp.student_id,
        title: `Staff Assigned: ${comp.tracking_number}`,
        message: `Technician ${staffName} from ${finalDeptName} has been assigned to your ticket.`,
        type: 'assignment',
        related_complaint_id: id,
        link: `/student/complaints/${id}`,
      });

      // Notification to Staff
      this.notifications.create({
        user_id: staffId,
        title: `New Ticket Assigned: ${comp.tracking_number}`,
        message: `You have been assigned to: "${comp.title}" at ${comp.location}.`,
        type: 'assignment',
        priority: comp.priority === 'Emergency' ? 'urgent' : 'normal',
        related_complaint_id: id,
        link: `/student/complaints/${id}`,
      });

      this.persist();
      return updatedComplaint;
    },
    addComment: (
      id: string,
      authorId: string,
      authorName: string,
      authorRole: string,
      content: string,
      avatarUrl?: string,
      isInternalNote = false
    ): ComplaintEntity | null => {
      const idx = this.data.complaints.findIndex(c => c.id === id);
      if (idx === -1) return null;

      const comp = this.data.complaints[idx];
      const now = new Date().toISOString();
      const newComment = {
        id: `cm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        authorId,
        authorName,
        authorRole,
        createdAt: now,
        content: content.trim(),
        avatarUrl,
        isInternalNote,
      };

      const updatedComplaint = {
        ...comp,
        comments: [...comp.comments, newComment],
        updated_at: now,
      };

      this.data.complaints[idx] = updatedComplaint;

      // If not internal, notify student if author is staff/admin, or notify staff if author is student
      if (!isInternalNote) {
        if (authorId !== comp.student_id) {
          this.notifications.create({
            user_id: comp.student_id,
            title: `New comment on ${comp.tracking_number}`,
            message: `${authorName}: "${content.length > 60 ? content.substring(0, 57) + '...' : content}"`,
            type: 'complaint_update',
            related_complaint_id: id,
            link: `/student/complaints/${id}`,
          });
        } else if (comp.assigned_staff_id && comp.assigned_staff_id !== authorId) {
          this.notifications.create({
            user_id: comp.assigned_staff_id,
            title: `Student replied on ${comp.tracking_number}`,
            message: `${authorName}: "${content.length > 60 ? content.substring(0, 57) + '...' : content}"`,
            type: 'complaint_update',
            related_complaint_id: id,
            link: `/student/complaints/${id}`,
          });
        }
      }

      this.persist();
      return updatedComplaint;
    },
    upvote: (id: string, userId?: string): ComplaintEntity | null => {
      const idx = this.data.complaints.findIndex(c => c.id === id);
      if (idx === -1) return null;

      const comp = this.data.complaints[idx];
      const upvoters = comp.upvoted_by || [];
      const hasUpvoted = userId ? upvoters.includes(userId) : false;

      let newCount = comp.upvotes;
      let newUpvoters = [...upvoters];

      if (userId && hasUpvoted) {
        newCount = Math.max(1, newCount - 1);
        newUpvoters = newUpvoters.filter(uid => uid !== userId);
      } else {
        newCount += 1;
        if (userId) newUpvoters.push(userId);
      }

      this.data.complaints[idx] = {
        ...comp,
        upvotes: newCount,
        upvoted_by: newUpvoters,
        updated_at: new Date().toISOString(),
      };

      this.persist();
      return this.data.complaints[idx];
    },
    submitRating: (id: string, rating: number, feedback?: string): ComplaintEntity | null => {
      const idx = this.data.complaints.findIndex(c => c.id === id);
      if (idx === -1) return null;

      this.data.complaints[idx] = {
        ...this.data.complaints[idx],
        satisfaction_rating: rating,
        satisfaction_feedback: feedback,
        updated_at: new Date().toISOString(),
      };

      this.persist();
      return this.data.complaints[idx];
    }
  };

  // ==========================================
  // STATUS HISTORY REPOSITORY
  // ==========================================
  public history = {
    getAll: (): ComplaintStatusHistoryEntity[] => this.data.complaint_status_history,
    getByComplaintId: (complaintId: string): ComplaintStatusHistoryEntity[] => {
      return this.data.complaint_status_history
        .filter(h => h.complaint_id === complaintId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    create: (historyData: {
      complaint_id: string;
      status: string;
      note?: string;
      updated_by: string;
    }): ComplaintStatusHistoryEntity => {
      const newEntry: ComplaintStatusHistoryEntity = {
        id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        complaint_id: historyData.complaint_id,
        status: historyData.status,
        note: historyData.note,
        updated_by: historyData.updated_by,
        created_at: new Date().toISOString(),
      };

      this.data.complaint_status_history.unshift(newEntry);
      this.persist();
      return newEntry;
    }
  };

  // ==========================================
  // NOTIFICATIONS REPOSITORY
  // ==========================================
  public notifications = {
    getAll: (userId?: string): NotificationEntity[] => {
      let list = this.data.notifications;
      if (userId) {
        list = list.filter(n => n.user_id === userId);
      }
      return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    create: (notifData: {
      user_id: string;
      title: string;
      message: string;
      type?: 'complaint_update' | 'campus_alert' | 'sla_warning' | 'lost_found_match' | 'assignment';
      priority?: 'normal' | 'urgent';
      related_complaint_id?: string;
      link?: string;
    }): NotificationEntity => {
      const newNotif: NotificationEntity = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        user_id: notifData.user_id,
        title: notifData.title,
        message: notifData.message,
        type: notifData.type || 'complaint_update',
        priority: notifData.priority || 'normal',
        read: false,
        related_complaint_id: notifData.related_complaint_id,
        link: notifData.link,
        created_at: new Date().toISOString(),
      };

      this.data.notifications.unshift(newNotif);
      this.persist();
      return newNotif;
    },
    broadcast: (title: string, message: string, priority: 'normal' | 'urgent' = 'normal'): void => {
      const now = new Date().toISOString();
      this.data.users.forEach(u => {
        this.data.notifications.unshift({
          id: `notif_bc_${u.id}_${Date.now()}`,
          user_id: u.id,
          title,
          message,
          type: 'campus_alert',
          priority,
          read: false,
          created_at: now,
        });
      });
      this.persist();
    },
    markAsRead: (id: string): boolean => {
      const notif = this.data.notifications.find(n => n.id === id);
      if (!notif) return false;
      notif.read = true;
      this.persist();
      return true;
    },
    markAllAsRead: (userId?: string): void => {
      this.data.notifications.forEach(n => {
        if (!userId || n.user_id === userId) {
          n.read = true;
        }
      });
      this.persist();
    },
  };

  // ==========================================
  // LOST & FOUND REPOSITORY
  // ==========================================
  public lostFound = {
    getAll: (): LostFoundEntity[] => {
      return this.data.lost_found_items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    getById: (id: string): LostFoundEntity | null => {
      return this.data.lost_found_items.find(item => item.id === id) || null;
    },
    create: (itemData: {
      reported_by: string;
      type: 'lost' | 'found';
      title: string;
      description: string;
      location: string;
      date?: string;
      category?: string;
      contact_info?: string;
      reported_by_name?: string;
      image_url?: string;
      possible_match?: string;
    }): LostFoundEntity => {
      const now = new Date().toISOString();
      const newItem: LostFoundEntity = {
        id: `lf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        reported_by: itemData.reported_by,
        type: itemData.type,
        title: itemData.title,
        description: itemData.description,
        location: itemData.location,
        date: itemData.date || now.split('T')[0],
        status: 'active',
        category: itemData.category || 'general',
        contact_info: itemData.contact_info,
        reported_by_name: itemData.reported_by_name,
        image_url: itemData.image_url,
        possible_match: itemData.possible_match,
        created_at: now,
        updated_at: now,
      };

      this.data.lost_found_items.unshift(newItem);
      this.persist();
      return newItem;
    },
    update: (id: string, updates: Partial<LostFoundEntity>): LostFoundEntity | null => {
      const idx = this.data.lost_found_items.findIndex(item => item.id === id);
      if (idx === -1) return null;

      this.data.lost_found_items[idx] = {
        ...this.data.lost_found_items[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      this.persist();
      return this.data.lost_found_items[idx];
    },
  };
}

// Singleton database instance on the server
export const databaseService = new DatabaseService();
