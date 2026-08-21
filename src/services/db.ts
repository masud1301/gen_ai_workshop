import {
  User,
  UserRole,
  Department,
  CampusLocation,
  Complaint,
  ComplaintStatusHistory,
  CampusNotification,
  LostFoundItem,
  ComplaintStatus,
} from '../types';
import { api } from './api';

// ==========================================
// DEMO SEED DATA (FOR TYPE/INITIAL RUNTIME COMPATIBILITY)
// ==========================================
export const DEMO_USERS_LIST: User[] = [
  {
    id: 'usr_student_01',
    name: 'Alex Rivera',
    email: 'alex.rivera@student.campus.edu',
    role: 'student',
    studentId: 'ST-2024-8841',
    department: 'Computer Science & Engineering',
    roomOrOffice: 'Hostel Block C, Room 312',
    phone: '+1 (555) 234-8901',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    created_at: '2026-01-15T08:00:00.000Z',
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'usr_faculty_01',
    name: 'Dr. Evelyn Vance',
    email: 'evelyn.vance@faculty.campus.edu',
    role: 'faculty',
    department: 'Department of Electrical Engineering',
    roomOrOffice: 'Turing Hall, Faculty Wing 402',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    created_at: '2025-08-20T09:30:00.000Z',
    createdAt: '2025-08-20T09:30:00.000Z',
  },
  {
    id: 'usr_staff_01',
    name: 'Marcus Jenkins',
    email: 'marcus.j@staff.campus.edu',
    role: 'staff',
    department: 'IT Support',
    roomOrOffice: 'Central Admin Bldg, Room 104',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    created_at: '2025-06-10T11:15:00.000Z',
    createdAt: '2025-06-10T11:15:00.000Z',
  },
  {
    id: 'usr_admin_01',
    name: 'Dean Arthur Patel',
    email: 'operations.admin@campus.edu',
    role: 'admin',
    department: 'Administration',
    roomOrOffice: 'Vice Chancellor Annex, Suite 500',
    phone: '+1 (555) 987-6543',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    created_at: '2025-01-01T00:00:00.000Z',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
];

export const DEMO_DEPARTMENTS_LIST: Department[] = [
  {
    id: 'dept_it_support',
    name: 'IT Support',
    description: 'Campus Wi-Fi, computer labs, network switches, AV systems, classroom smartboards, and software accounts.',
    status: 'active',
    created_at: '2025-01-01T00:00:00.000Z',
    code: 'IT-SUP',
    category: 'it_network',
    headName: 'Vikram Joshi',
    headEmail: 'v.joshi@campus.edu',
    contactEmail: 'itsupport@campus.edu',
    activeStaffCount: 8,
    openTicketsCount: 5,
    slaAvgHours: 4.2,
    avgResolutionHours: 4.2,
    slaComplianceRate: 97.4,
    slaTargetPercentage: 97.4,
    colorTheme: 'blue',
  },
  {
    id: 'dept_electrical_maintenance',
    name: 'Electrical Maintenance',
    description: 'Power distribution, high-voltage lines, classroom lighting, power sockets, transformers, and emergency generators.',
    status: 'active',
    created_at: '2025-01-01T00:00:00.000Z',
    code: 'ELEC-MAINT',
    category: 'electrical_power',
    headName: 'Robert Vance',
    headEmail: 'r.vance@campus.edu',
    contactEmail: 'electrical@campus.edu',
    activeStaffCount: 6,
    openTicketsCount: 3,
    slaAvgHours: 2.5,
    avgResolutionHours: 2.5,
    slaComplianceRate: 99.1,
    slaTargetPercentage: 99.1,
    colorTheme: 'yellow',
  },
  {
    id: 'dept_facility_management',
    name: 'Facility Management',
    description: 'Physical campus infrastructure, desks, podiums, AC cooling units, doors, locks, elevators, and hostel furniture.',
    status: 'active',
    created_at: '2025-01-01T00:00:00.000Z',
    code: 'FAC-MGMT',
    category: 'hostel_maintenance',
    headName: 'Sarah Jenkins',
    headEmail: 's.jenkins@campus.edu',
    contactEmail: 'facilities@campus.edu',
    activeStaffCount: 12,
    openTicketsCount: 9,
    slaAvgHours: 6.8,
    avgResolutionHours: 6.8,
    slaComplianceRate: 94.1,
    slaTargetPercentage: 94.1,
    colorTheme: 'amber',
  },
  {
    id: 'dept_housekeeping',
    name: 'Housekeeping',
    description: 'Daily campus sanitation, hygiene services, floor disinfection, trash collection, and restroom sanitization.',
    status: 'active',
    created_at: '2025-01-01T00:00:00.000Z',
    code: 'HOUSEKEEP',
    category: 'campus_hygiene',
    headName: 'Lillian Miller',
    headEmail: 'l.miller@campus.edu',
    contactEmail: 'housekeeping@campus.edu',
    activeStaffCount: 15,
    openTicketsCount: 4,
    slaAvgHours: 3.5,
    avgResolutionHours: 3.5,
    slaComplianceRate: 96.0,
    slaTargetPercentage: 96.0,
    colorTheme: 'emerald',
  },
  {
    id: 'dept_plumbing',
    name: 'Plumbing',
    description: 'Clean drinking water dispensers, restroom plumbing, pipeline leaks, drainage lines, and water tank purifiers.',
    status: 'active',
    created_at: '2025-01-01T00:00:00.000Z',
    code: 'PLUMB-SERV',
    category: 'plumbing_water',
    headName: 'Maria Rodriguez',
    headEmail: 'm.rodriguez@campus.edu',
    contactEmail: 'plumbing@campus.edu',
    activeStaffCount: 9,
    openTicketsCount: 4,
    slaAvgHours: 5.1,
    avgResolutionHours: 5.1,
    slaComplianceRate: 95.8,
    slaTargetPercentage: 95.8,
    colorTheme: 'cyan',
  },
  {
    id: 'dept_security',
    name: 'Security',
    description: 'Campus gate security, keycard access, emergency assistance, lost & found logistics, and night surveillance.',
    status: 'active',
    created_at: '2025-01-01T00:00:00.000Z',
    code: 'SEC-CAMPUS',
    category: 'security_safety',
    headName: 'Captain David Brooks',
    headEmail: 'd.brooks@campus.edu',
    contactEmail: 'security@campus.edu',
    activeStaffCount: 18,
    openTicketsCount: 2,
    slaAvgHours: 1.8,
    avgResolutionHours: 1.8,
    slaComplianceRate: 99.5,
    slaTargetPercentage: 99.5,
    colorTheme: 'rose',
  },
  {
    id: 'dept_administration',
    name: 'Administration',
    description: 'Campus governance, academic policy enforcement, budget allocations, resource planning, and grievance appeals.',
    status: 'active',
    created_at: '2025-01-01T00:00:00.000Z',
    code: 'ADMIN-CENTRAL',
    category: 'transport_parking',
    headName: 'Dean Arthur Patel',
    headEmail: 'operations.admin@campus.edu',
    contactEmail: 'admin@campus.edu',
    activeStaffCount: 10,
    openTicketsCount: 3,
    slaAvgHours: 12.0,
    avgResolutionHours: 12.0,
    slaComplianceRate: 98.0,
    slaTargetPercentage: 98.0,
    colorTheme: 'purple',
  },
];

export const DEMO_LOCATIONS_LIST: CampusLocation[] = [
  {
    id: 'loc_main_block',
    name: 'Main Block',
    building: 'Main Administrative & Academic Wing',
    code: 'MB-01',
    description: 'Primary administrative offices, Dean office, auditorium entrance, and central reception.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'loc_comp_lab_1',
    name: 'Computer Lab 1',
    building: 'Turing Information Technology Complex',
    code: 'CL-01',
    description: 'High-performance AI workstation lab, 60 networked workstations, gigabit switch.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'loc_comp_lab_2',
    name: 'Computer Lab 2',
    building: 'Turing Information Technology Complex',
    code: 'CL-02',
    description: 'Software engineering & algorithm design laboratory with 45 dual-monitor stations.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'loc_room_204',
    name: 'Room 204',
    building: 'Block B - Science & Engineering',
    code: 'RM-204',
    description: 'Tiered 120-seat lecture hall with ceiling projector, wireless mic, and dual AC.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'loc_library',
    name: 'Library',
    building: 'Central Learning Commons',
    code: 'LIB-CENTRAL',
    description: 'Three-story research library with silent study zones, e-resource portals, and archives.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'loc_auditorium',
    name: 'Auditorium',
    building: 'Main Block - Grand Hall',
    code: 'AUD-GRAND',
    description: '800-seat grand auditorium for convocations, tech symposiums, and cultural festivals.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'loc_block_b',
    name: 'Block B',
    building: 'Block B - Science & Engineering',
    code: 'BLK-B',
    description: 'Undergraduate science lecture halls, physics labs, faculty lounges, and seminar rooms.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'loc_hostel',
    name: 'Hostel',
    building: 'Residential Block C & Quad',
    code: 'HSTL-C',
    description: 'Student residential halls, dining mess hall, recreation lounge, and laundry rooms.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'loc_cafeteria',
    name: 'Cafeteria',
    building: 'Student Activity & Dining Hub',
    code: 'CAFE-01',
    description: 'Multi-cuisine campus dining facility, food court, juice bar, and outdoor terrace seating.',
    is_demo: true,
    created_at: '2025-01-01T00:00:00.000Z',
  },
];

export const DEMO_COMPLAINTS_LIST: Complaint[] = [
  {
    id: 'comp_001',
    trackingNumber: 'SF-001',
    student_id: 'usr_student_01',
    title: 'Frequent Wi-Fi Disconnections in Computer Lab 1',
    description: 'The Wi-Fi access point in Computer Lab 1 keeps dropping connection every 5 minutes during our AI practicals.',
    original_message: 'The Wi-Fi access point in Computer Lab 1 keeps dropping connection every 5 minutes during our AI practicals.',
    issue: 'Frequent Wi-Fi Disconnections in Computer Lab 1',
    category: 'IT / Network',
    location: 'Computer Lab 1',
    building: 'Turing Information Technology Complex',
    roomNumber: 'Lab 1',
    priority: 'High',
    department_id: 'dept_it_support',
    assigned_staff_id: 'usr_staff_01',
    status: 'In Progress',
    duplicateCount: 0,
    aiAnalysis: {
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
    upvotedBy: ['usr_student_01'],
    userUpvoted: true,
    is_demo: true,
    createdAt: '2026-08-20T10:14:00.000Z',
    updatedAt: '2026-08-20T14:30:00.000Z',
    created_at: '2026-08-20T10:14:00.000Z',
    updated_at: '2026-08-20T14:30:00.000Z',
    submittedBy: {
      id: 'usr_student_01',
      name: 'Alex Rivera',
      role: 'student',
      email: 'alex.rivera@student.campus.edu',
      roomOrOffice: 'Hostel Block C, Room 312',
      studentId: 'ST-2024-8841',
    },
    assignedDepartmentId: 'dept_it_support',
    assignedDepartmentName: 'IT Support',
    assignedStaffId: 'usr_staff_01',
    assignedStaffName: 'Marcus Jenkins',
  },
  {
    id: 'comp_002',
    trackingNumber: 'SF-002',
    student_id: 'usr_faculty_01',
    title: 'Overheating HDMI Projector in Room 204',
    description: 'Projector in Room 204 has a flickering blue tint and shuts down after 10 minutes of lecture.',
    original_message: 'Projector in Room 204 has a flickering blue tint and shuts down after 10 minutes of lecture.',
    issue: 'Overheating HDMI Projector in Room 204',
    category: 'Classroom Equipment',
    location: 'Room 204',
    building: 'Block B - Science & Engineering',
    roomNumber: 'Room 204',
    priority: 'Medium',
    department_id: 'dept_it_support',
    assigned_staff_id: 'usr_staff_01',
    status: 'Assigned',
    duplicateCount: 0,
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
    createdAt: '2026-08-20T11:30:00.000Z',
    updatedAt: '2026-08-20T12:00:00.000Z',
    created_at: '2026-08-20T11:30:00.000Z',
    updated_at: '2026-08-20T12:00:00.000Z',
    submittedBy: {
      id: 'usr_faculty_01',
      name: 'Dr. Evelyn Vance',
      role: 'faculty',
      email: 'evelyn.vance@faculty.campus.edu',
      roomOrOffice: 'Turing Hall, Faculty Wing 402',
    },
    assignedDepartmentId: 'dept_it_support',
    assignedDepartmentName: 'IT Support',
    assignedStaffId: 'usr_staff_01',
    assignedStaffName: 'Marcus Jenkins',
  },
  {
    id: 'comp_003',
    trackingNumber: 'SF-003',
    student_id: 'usr_student_01',
    title: 'Water Pipe Leak in Hostel 3rd Floor Restroom',
    description: 'Water leakage in 3rd floor washroom of Hostel Block C near room 310.',
    original_message: 'Water leakage in 3rd floor washroom of Hostel Block C near room 310.',
    issue: 'Water Pipe Leak in Hostel 3rd Floor Restroom',
    category: 'Water / Plumbing',
    location: 'Hostel',
    building: 'Hostel Block C',
    roomNumber: '3rd Floor Restroom',
    priority: 'Emergency',
    department_id: 'dept_plumbing',
    assigned_staff_id: 'usr_staff_01',
    status: 'In Progress',
    duplicateCount: 0,
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
    createdAt: '2026-08-20T08:00:00.000Z',
    updatedAt: '2026-08-20T09:15:00.000Z',
    created_at: '2026-08-20T08:00:00.000Z',
    updated_at: '2026-08-20T09:15:00.000Z',
    submittedBy: {
      id: 'usr_student_01',
      name: 'Alex Rivera',
      role: 'student',
      email: 'alex.rivera@student.campus.edu',
      roomOrOffice: 'Hostel Block C, Room 312',
    },
    assignedDepartmentId: 'dept_plumbing',
    assignedDepartmentName: 'Plumbing',
  },
  {
    id: 'comp_004',
    trackingNumber: 'SF-004',
    student_id: 'usr_student_01',
    title: 'Electrical Buzzing Noise near Library Main Floor',
    description: 'Main electrical distribution panel making buzzing noise near Library ground floor.',
    original_message: 'Main electrical distribution panel making buzzing noise near Library ground floor.',
    issue: 'Electrical Buzzing Noise near Library Main Floor',
    category: 'Electrical',
    location: 'Library',
    building: 'Library',
    roomNumber: 'Ground Floor Utility',
    priority: 'High',
    department_id: 'dept_electrical_maintenance',
    status: 'Resolved',
    duplicateCount: 0,
    resolvedAt: '2026-08-19T16:45:00.000Z',
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
    satisfactionRating: 5,
    satisfactionFeedback: 'Super fast turnaround! The quiet study space is quiet again.',
    is_demo: true,
    createdAt: '2026-08-19T09:00:00.000Z',
    updatedAt: '2026-08-19T16:45:00.000Z',
    created_at: '2026-08-19T09:00:00.000Z',
    updated_at: '2026-08-19T16:45:00.000Z',
    submittedBy: {
      id: 'usr_student_01',
      name: 'Alex Rivera',
      role: 'student',
      email: 'alex.rivera@student.campus.edu',
    },
    assignedDepartmentId: 'dept_electrical_maintenance',
    assignedDepartmentName: 'Electrical Maintenance',
  },
];

export const DEMO_STATUS_HISTORY: ComplaintStatusHistory[] = [
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

export const DEMO_NOTIFICATIONS_LIST: CampusNotification[] = [
  {
    id: 'notif_001',
    user_id: 'usr_student_01',
    title: 'Work Order In Progress: SMART-2026-1044',
    message: 'Marcus Jenkins from IT Support has started work on your Wi-Fi issue in Computer Lab 1.',
    type: 'complaint_update',
    read: false,
    created_at: '2026-08-20T14:30:00.000Z',
    createdAt: '2026-08-20T14:30:00.000Z',
    relatedComplaintId: 'comp_001',
    link: '/student/complaints/comp_001',
  },
  {
    id: 'notif_002',
    user_id: 'usr_student_01',
    title: 'Scheduled Maintenance Notice',
    message: 'Campus water pipeline maintenance scheduled for Hostel Block C on Saturday between 2 PM - 5 PM.',
    type: 'campus_alert',
    read: true,
    created_at: '2026-08-19T09:00:00.000Z',
    createdAt: '2026-08-19T09:00:00.000Z',
  },
  {
    id: 'notif_003',
    user_id: 'usr_faculty_01',
    title: 'SmartFix AI: Room 204 Projector Assigned',
    message: 'Work order dispatched to IT Support. Expected completion within 2 hours.',
    type: 'complaint_update',
    read: false,
    created_at: '2026-08-20T12:00:00.000Z',
    createdAt: '2026-08-20T12:00:00.000Z',
    relatedComplaintId: 'comp_002',
    link: '/student/complaints/comp_002',
  },
];

export const DEMO_LOST_FOUND_LIST: LostFoundItem[] = [
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
    created_at: '2026-08-20T12:30:00.000Z',
    contactInfo: 'alex.rivera@student.campus.edu',
    reportedByName: 'Alex Rivera',
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80',
    aiSuggestedMatchId: 'lf_002',
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
    contactInfo: 'security@campus.edu (Ext. 2201)',
    reportedByName: 'Campus Security Desk',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80',
    aiSuggestedMatchId: 'lf_001',
    created_at: '2026-08-20T17:00:00.000Z',
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
    created_at: '2026-08-19T14:15:00.000Z',
    contactInfo: 'library.desk@campus.edu',
    reportedByName: 'Central Library Desk',
    category: 'accessories',
  },
];

// ==========================================
// SERVER-SYNCHRONIZED DATABASE BRIDGE
// ==========================================
class ServerPersistentDatabase {
  private listeners: Set<() => void> = new Set();
  private isLoaded = false;
  private syncTimer: any = null;

  // In-memory synced state
  private _users: User[] = DEMO_USERS_LIST;
  private _departments: Department[] = DEMO_DEPARTMENTS_LIST;
  private _locations: CampusLocation[] = DEMO_LOCATIONS_LIST;
  private _complaints: Complaint[] = DEMO_COMPLAINTS_LIST;
  private _history: ComplaintStatusHistory[] = DEMO_STATUS_HISTORY;
  private _notifications: CampusNotification[] = DEMO_NOTIFICATIONS_LIST;
  private _lostFound: LostFoundItem[] = DEMO_LOST_FOUND_LIST;
  private _currentSessionUser: User | null = null;
  private _connectionStatus: 'connected' | 'connecting' | 'error' = 'connecting';

  constructor() {
    this.initDatabase();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public notify() {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('Error in db subscriber:', err);
      }
    });
  }

  public getConnectionStatus() {
    return this._connectionStatus;
  }

  // Load state from backend Express API
  public async initDatabase() {
    if (typeof window === 'undefined') return;

    try {
      await this.refreshFromServer();
      this._connectionStatus = 'connected';
    } catch (e) {
      console.warn('Initial server sync deferred; running on current state cache:', e);
      this._connectionStatus = 'error';
    }

    // Start background sync every 4 seconds for cross-browser synchronization
    if (!this.syncTimer) {
      this.syncTimer = setInterval(() => {
        this.refreshFromServer().catch(() => {});
      }, 4000);
    }
  }

  public async refreshFromServer() {
    try {
      const [u, d, l, c, n, lf] = await Promise.all([
        api.users.getAll().catch(() => this._users),
        api.departments.getAll().catch(() => this._departments),
        api.locations.getAll().catch(() => this._locations),
        api.complaints.getAll().catch(() => this._complaints),
        api.notifications.getAll().catch(() => this._notifications),
        api.lostFound.getAll().catch(() => this._lostFound),
      ]);

      let hasChanges = false;

      if (JSON.stringify(u) !== JSON.stringify(this._users)) {
        this._users = u;
        hasChanges = true;
      }
      if (JSON.stringify(d) !== JSON.stringify(this._departments)) {
        this._departments = d;
        hasChanges = true;
      }
      if (JSON.stringify(l) !== JSON.stringify(this._locations)) {
        this._locations = l;
        hasChanges = true;
      }
      if (JSON.stringify(c) !== JSON.stringify(this._complaints)) {
        this._complaints = c;
        hasChanges = true;
      }
      if (JSON.stringify(n) !== JSON.stringify(this._notifications)) {
        this._notifications = n;
        hasChanges = true;
      }
      if (JSON.stringify(lf) !== JSON.stringify(this._lostFound)) {
        this._lostFound = lf;
        hasChanges = true;
      }

      this.isLoaded = true;
      this._connectionStatus = 'connected';

      if (hasChanges) {
        this.notify();
      }
    } catch (err) {
      this._connectionStatus = 'error';
      throw err;
    }
  }

  // ==========================================
  // USERS
  // ==========================================
  public users = {
    getAll: (): User[] => this._users,
    getById: (id: string): User | undefined => this._users.find(u => u.id === id),
    getByEmail: (email: string): User | undefined =>
      this._users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()),
    create: (userData: any): User => {
      const tempId = userData.id || `usr_${Date.now()}`;
      const now = new Date().toISOString();
      const newUser: User = {
        ...userData,
        id: tempId,
        status: userData.status || 'active',
        createdAt: now,
        created_at: now,
      };

      // Optimistic cache update
      this._users = [...this._users, newUser];
      this.notify();

      // Async backend persist
      api.users.create(userData).then(created => {
        const idx = this._users.findIndex(u => u.id === tempId);
        if (idx !== -1) {
          this._users[idx] = created;
          this.notify();
        }
      }).catch(err => console.error('Failed to create user on server:', err));

      return newUser;
    },
    update: (id: string, updates: Partial<User>): User | null => {
      const idx = this._users.findIndex(u => u.id === id);
      if (idx === -1) return null;

      const updated = { ...this._users[idx], ...updates, updatedAt: new Date().toISOString() };
      this._users[idx] = updated;
      this.notify();

      // Async server persist
      api.users.update(id, updates).catch(err => console.error('Failed to update user on server:', err));
      return updated;
    },
    delete: (id: string): boolean => {
      this._users = this._users.filter(u => u.id !== id);
      this.notify();
      api.users.delete(id).catch(err => console.error('Failed to delete user on server:', err));
      return true;
    },
  };

  // ==========================================
  // DEPARTMENTS
  // ==========================================
  public departments = {
    getAll: (): Department[] => this._departments,
    getById: (id: string): Department | undefined => this._departments.find(d => d.id === id),
    create: (deptData: any): Department => {
      const id = deptData.id || `dept_${Date.now()}`;
      const newDept: Department = { ...deptData, id, status: deptData.status || 'active', created_at: new Date().toISOString() };
      this._departments = [...this._departments, newDept];
      this.notify();
      return newDept;
    },
    update: (id: string, updates: Partial<Department>): Department | null => {
      const idx = this._departments.findIndex(d => d.id === id);
      if (idx === -1) return null;
      this._departments[idx] = { ...this._departments[idx], ...updates };
      this.notify();
      api.departments.update(id, updates).catch(err => console.error('Failed to update department on server:', err));
      return this._departments[idx];
    },
    delete: (id: string): boolean => {
      this._departments = this._departments.filter(d => d.id !== id);
      this.notify();
      return true;
    },
  };

  // ==========================================
  // LOCATIONS
  // ==========================================
  public locations = {
    getAll: (): CampusLocation[] => this._locations,
    getById: (id: string): CampusLocation | undefined => this._locations.find(l => l.id === id),
    create: (locData: any): CampusLocation => {
      const newLoc = { ...locData, id: `loc_${Date.now()}`, created_at: new Date().toISOString() };
      this._locations = [...this._locations, newLoc];
      this.notify();
      return newLoc;
    },
  };

  // ==========================================
  // COMPLAINTS
  // ==========================================
  public complaints = {
    getAll: (): Complaint[] => this._complaints,
    getById: (id: string): Complaint | undefined => this._complaints.find(c => c.id === id),
    getByStudentId: (studentId: string): Complaint[] =>
      this._complaints.filter(c => c.student_id === studentId || c.submittedBy?.id === studentId),
    getByDepartmentId: (deptId: string): Complaint[] =>
      this._complaints.filter(c => c.department_id === deptId || c.assignedDepartmentId === deptId),
    create: (complaintData: any): Complaint => {
      const now = new Date().toISOString();
      const id = complaintData.id || `comp_${Date.now()}`;
      const trackingNumber = complaintData.trackingNumber || `SF-${String(this._complaints.length + 1).padStart(3, '0')}`;

      const newComplaint: Complaint = {
        id,
        trackingNumber,
        student_id: complaintData.student_id,
        title: complaintData.title || complaintData.issue,
        description: complaintData.description || complaintData.original_message,
        original_message: complaintData.original_message || complaintData.description,
        issue: complaintData.issue || complaintData.title,
        category: complaintData.category,
        location: complaintData.location,
        building: complaintData.building || complaintData.location,
        roomNumber: complaintData.roomNumber,
        priority: complaintData.priority || 'Medium',
        department_id: complaintData.department_id,
        assigned_staff_id: complaintData.assigned_staff_id,
        status: complaintData.status || 'Submitted',
        duplicateCount: complaintData.duplicateCount || 0,
        aiAnalysis: complaintData.aiAnalysis,
        timeline: complaintData.timeline || [
          {
            id: `tl_${Date.now()}_1`,
            timestamp: now,
            actorName: complaintData.submittedBy?.name || 'Student Submitter',
            actorRole: complaintData.submittedBy?.role || 'student',
            title: 'Complaint Submitted',
            description: `Ticket registered under tracking #${trackingNumber}`,
            statusChange: 'submitted',
          },
        ],
        comments: complaintData.comments || [],
        attachments: complaintData.attachments || [],
        upvotes: complaintData.upvotes ?? 1,
        upvotedBy: [complaintData.student_id],
        is_demo: complaintData.is_demo ?? false,
        createdAt: now,
        updatedAt: now,
        created_at: now,
        updated_at: now,
        submittedBy: complaintData.submittedBy || {
          id: complaintData.student_id,
          name: 'Student Submitter',
          role: 'student',
          email: 'student@campus.edu',
        },
        assignedDepartmentId: complaintData.department_id,
        assignedDepartmentName: complaintData.assignedDepartmentName || 'Department Support',
      };

      // Optimistic cache update
      this._complaints = [newComplaint, ...this._complaints];
      this.notify();

      // Async backend persist
      api.complaints.create({
        student_id: complaintData.student_id,
        title: newComplaint.title,
        description: newComplaint.description,
        category: newComplaint.category,
        location: newComplaint.location,
        building: newComplaint.building,
        room_number: newComplaint.roomNumber,
        priority: newComplaint.priority,
        department_id: newComplaint.department_id,
        assigned_staff_id: newComplaint.assigned_staff_id,
        ai_analysis: newComplaint.aiAnalysis,
        attachments: newComplaint.attachments,
        is_demo: newComplaint.is_demo,
      }).then(created => {
        const idx = this._complaints.findIndex(c => c.id === id);
        if (idx !== -1) {
          this._complaints[idx] = created;
          this.notify();
        }
      }).catch(err => console.error('Failed to create complaint on server:', err));

      return newComplaint;
    },
    update: (id: string, updates: Partial<Complaint>, actorName = 'System'): Complaint | null => {
      const idx = this._complaints.findIndex(c => c.id === id);
      if (idx === -1) return null;

      const now = new Date().toISOString();
      const updated = {
        ...this._complaints[idx],
        ...updates,
        updatedAt: now,
        updated_at: now,
      };

      this._complaints[idx] = updated;
      this.notify();

      api.complaints.update(id, updates).catch(err => console.error('Failed to update complaint on server:', err));
      return updated;
    },
  };

  // ==========================================
  // HISTORY
  // ==========================================
  public history = {
    getAll: (): ComplaintStatusHistory[] => this._history,
    getByComplaintId: (complaintId: string): ComplaintStatusHistory[] =>
      this._history.filter(h => h.complaint_id === complaintId),
    create: (historyData: any): ComplaintStatusHistory => {
      const newEntry = {
        ...historyData,
        id: `hist_${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      this._history = [newEntry, ...this._history];
      this.notify();
      return newEntry;
    },
  };

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  public notifications = {
    getAll: (): CampusNotification[] => this._notifications,
    getByUserId: (userId: string): CampusNotification[] =>
      this._notifications.filter(n => n.user_id === userId),
    create: (notifData: any): CampusNotification => {
      const newNotif: CampusNotification = {
        ...notifData,
        id: `notif_${Date.now()}`,
        read: notifData.read ?? false,
        created_at: notifData.created_at || new Date().toISOString(),
        createdAt: notifData.created_at || new Date().toISOString(),
      };
      this._notifications = [newNotif, ...this._notifications];
      this.notify();

      api.notifications.create(notifData).catch(err => console.error('Failed to create notification on server:', err));
      return newNotif;
    },
    markAsRead: (id: string) => {
      this._notifications = this._notifications.map(n => (n.id === id ? { ...n, read: true } : n));
      this.notify();
      api.notifications.markAsRead(id).catch(err => console.error('Failed to mark notification read on server:', err));
    },
    markAllAsRead: (userId?: string) => {
      this._notifications = this._notifications.map(n =>
        (!userId || n.user_id === userId ? { ...n, read: true } : n)
      );
      this.notify();
      api.notifications.markAllAsRead(userId).catch(err => console.error('Failed to mark all read on server:', err));
    },
  };

  // ==========================================
  // LOST & FOUND
  // ==========================================
  public lostFound = {
    getAll: (): LostFoundItem[] => this._lostFound,
    getById: (id: string): LostFoundItem | undefined => this._lostFound.find(item => item.id === id),
    create: (itemData: any): LostFoundItem => {
      const newItem: LostFoundItem = {
        ...itemData,
        id: `lf_${Date.now()}`,
        created_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        status: itemData.status || 'active',
      };
      this._lostFound = [newItem, ...this._lostFound];
      this.notify();

      api.lostFound.create(itemData).catch(err => console.error('Failed to create lost item on server:', err));
      return newItem;
    },
    update: (id: string, updates: Partial<LostFoundItem>): LostFoundItem | null => {
      const idx = this._lostFound.findIndex(item => item.id === id);
      if (idx === -1) return null;
      this._lostFound[idx] = { ...this._lostFound[idx], ...updates };
      this.notify();

      api.lostFound.update(id, updates).catch(err => console.error('Failed to update lost item on server:', err));
      return this._lostFound[idx];
    },
  };

  // ==========================================
  // AUTH & SESSION
  // ==========================================
  public auth = {
    getSession: (): { user: User; token: string } | null => {
      if (this._currentSessionUser) {
        return { user: this._currentSessionUser, token: 'server_session_active' };
      }
      return null;
    },
    setSession: (user: User): { user: User; token: string } => {
      this._currentSessionUser = user;
      this.notify();
      return { user, token: 'server_session_active' };
    },
    clearSession: () => {
      this._currentSessionUser = null;
      api.auth.logout().catch(() => {});
      this.notify();
    },
    login: (email: string, password?: string): { success: boolean; user?: User; error?: string } => {
      const user = db.users.getByEmail(email);
      if (!user) {
        return { success: false, error: 'No campus account found with this email address.' };
      }
      if (user.status === 'suspended' || user.status === 'inactive') {
        return { success: false, error: 'This campus account is suspended. Please contact Administration.' };
      }
      this._currentSessionUser = user;
      this.notify();
      return { success: true, user };
    },
    demoLogin: (role: UserRole): User => {
      const matched = db.users.getAll().find(u => u.role === role && u.status === 'active') ||
        DEMO_USERS_LIST.find(u => u.role === role) ||
        DEMO_USERS_LIST[0];
      this._currentSessionUser = matched;
      this.notify();

      // Trigger background demo login on server to sync token
      api.auth.demoLogin(role).catch(() => {});
      return matched;
    },
    register: (userData: any): { success: boolean; user?: User; error?: string } => {
      const existing = db.users.getByEmail(userData.email);
      if (existing) {
        return { success: false, error: 'An account with this email address already exists.' };
      }
      const newUser = db.users.create({
        ...userData,
        status: 'active',
      });
      this._currentSessionUser = newUser;
      this.notify();
      return { success: true, user: newUser };
    },
  };

  // Reset database to initial campus defaults
  public resetToDefaults() {
    api.database.reset().then(() => {
      this.refreshFromServer();
    }).catch(() => {
      this._users = DEMO_USERS_LIST;
      this._departments = DEMO_DEPARTMENTS_LIST;
      this._locations = DEMO_LOCATIONS_LIST;
      this._complaints = DEMO_COMPLAINTS_LIST;
      this._history = DEMO_STATUS_HISTORY;
      this._notifications = DEMO_NOTIFICATIONS_LIST;
      this._lostFound = DEMO_LOST_FOUND_LIST;
      this._currentSessionUser = DEMO_USERS_LIST[0];
      this.notify();
    });
  }
}

export const db = new ServerPersistentDatabase();
