import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Complaint,
  Department,
  CampusLocation,
  LostFoundItem,
  CampusNotification,
  ComplaintStatus,
  PriorityLevel,
  IssueCategory,
  UserRole,
  RecurringIssueCluster,
  ComplaintStatusHistory,
  StandardCategory,
  StandardPriority,
} from '../types';
import { RECURRING_ISSUE_CLUSTERS } from '../services/mockData';
import { analyzeComplaintText } from '../services/aiService';
import { db } from '../services/db';
import { api } from '../services/api';

interface CreateComplaintInput {
  title: string;
  description: string;
  category?: IssueCategory | StandardCategory | string;
  standardCategory?: StandardCategory;
  location: string;
  building?: string;
  roomNumber?: string;
  room_number?: string;
  priority?: PriorityLevel | StandardPriority | string;
  standardPriority?: StandardPriority;
  department_id?: string;
  assignedDepartmentId?: string;
  assignedDepartmentName?: string;
  student_id?: string;
  submittedBy?: {
    id: string;
    name: string;
    role: UserRole;
    email: string;
    roomOrOffice?: string;
    studentId?: string;
  };
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'document';
  }[];
  aiAnalysis?: any;
  is_demo?: boolean;
}

interface ComplaintContextType {
  complaints: Complaint[];
  departments: Department[];
  locations: CampusLocation[];
  lostFoundItems: LostFoundItem[];
  notifications: CampusNotification[];
  recurringClusters: RecurringIssueCluster[];
  statusHistory: ComplaintStatusHistory[];
  unreadNotificationCount: number;
  
  // Actions
  submitComplaint: (input: CreateComplaintInput) => Promise<Complaint>;
  createComplaint: (input: CreateComplaintInput) => Promise<Complaint>;
  updateComplaintStatus: (id: string, newStatus: ComplaintStatus, actorNameOrNote?: string, actorRole?: UserRole, note?: string) => void;
  assignStaff: (complaintId: string, staffId: string, staffName: string, deptId?: string, deptName?: string) => void;
  assignComplaint: (complaintId: string, staffId: string, staffName: string, deptId?: string, deptName?: string) => void;
  addComment: (complaintId: string, authorId: string, authorName: string, authorRole: UserRole, content: string, avatarUrl?: string, isInternalNote?: boolean) => void;
  upvoteComplaint: (complaintId: string) => void;
  submitSatisfactionRating: (complaintId: string, rating: number, feedback?: string) => void;
  
  // Lost & Found
  addLostFoundItem: (item: Omit<LostFoundItem, 'id' | 'status' | 'created_at'>) => void;
  markLostFoundClaimed: (id: string) => void;
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: (userId?: string) => void;
  sendBroadcastNotification: (title: string, message: string, priority?: 'normal' | 'urgent') => void;
  
  // Department management
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  
  // Reset demo
  resetToDefaultData: () => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => db.complaints.getAll());
  const [departments, setDepartments] = useState<Department[]>(() => db.departments.getAll());
  const [locations, setLocations] = useState<CampusLocation[]>(() => db.locations.getAll());
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(() => db.lostFound.getAll());
  const [notifications, setNotifications] = useState<CampusNotification[]>(() => db.notifications.getAll());
  const [statusHistory, setStatusHistory] = useState<ComplaintStatusHistory[]>(() => db.history.getAll());
  const [recurringClusters] = useState<RecurringIssueCluster[]>(RECURRING_ISSUE_CLUSTERS);

  // Sync state with DB changes
  const syncWithDb = useCallback(() => {
    setComplaints(db.complaints.getAll());
    setDepartments(db.departments.getAll());
    setLocations(db.locations.getAll());
    setLostFoundItems(db.lostFound.getAll());
    setNotifications(db.notifications.getAll());
    setStatusHistory(db.history.getAll());
  }, []);

  useEffect(() => {
    const unsubscribe = db.subscribe(syncWithDb);
    return () => unsubscribe();
  }, [syncWithDb]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const submitComplaint = async (input: CreateComplaintInput): Promise<Complaint> => {
    const studentId = input.student_id || input.submittedBy?.id || 'usr_student_01';
    const effectiveCategory = input.standardCategory || input.category || 'Other';
    const effectivePriority = input.standardPriority || input.priority || 'Medium';
    const effectiveLocation = input.location || input.building || 'Campus Facility';
    const effectiveDeptId = input.department_id || input.assignedDepartmentId || 'dept_facility_management';

    try {
      // 1. Call persistent backend API endpoint
      const createdServerComplaint = await api.complaints.create({
        student_id: studentId,
        title: input.title,
        description: input.description,
        category: effectiveCategory as string,
        location: effectiveLocation,
        building: input.building || effectiveLocation,
        room_number: input.room_number || input.roomNumber,
        priority: effectivePriority as string,
        department_id: effectiveDeptId,
        assigned_staff_id: (input as any).assigned_staff_id || (input as any).assignedStaffId,
        ai_analysis: input.aiAnalysis,
        attachments: input.attachments || [],
        is_demo: input.is_demo ?? true,
      });

      // 2. Update local state and trigger subscribers
      setComplaints(prev => [createdServerComplaint, ...prev.filter(c => c.id !== createdServerComplaint.id)]);
      
      // Also refresh db cache
      db.complaints.getAll();

      return createdServerComplaint;
    } catch (err: any) {
      console.error('[COMPLAINT_SUBMISSION_SERVICE_ERROR]', {
        status: err?.status,
        message: err?.message,
        data: err?.data,
        originalError: err,
      });
      throw err;
    }
  };

  const createComplaint = submitComplaint;

  const updateComplaintStatus = (
    id: string,
    newStatus: ComplaintStatus,
    arg3?: string,
    arg4?: UserRole,
    arg5?: string
  ) => {
    const timestamp = new Date().toISOString();
    const target = complaints.find(c => c.id === id);
    if (!target) return;

    let actorName = 'Campus Maintenance';
    let actorRole: UserRole = 'staff';
    let note: string | undefined = undefined;

    if (arg4) {
      // Called with (id, newStatus, actorName, actorRole, note)
      actorName = arg3 || 'Campus Maintenance';
      actorRole = arg4;
      note = arg5;
    } else {
      // Called with (id, newStatus, note)
      note = arg3;
    }

    const updatedTimeline = [
      ...target.timeline,
      {
        id: `tl_${Date.now()}`,
        timestamp,
        actorName,
        actorRole,
        title: `Status updated to ${newStatus.replace('_', ' ').toUpperCase()}`,
        description: note || `Updated by ${actorName} (${actorRole}).`,
        statusChange: newStatus,
        note,
      },
    ];

    db.complaints.update(
      id,
      {
        status: newStatus,
        updatedAt: timestamp,
        resolvedAt: newStatus === 'resolved' ? timestamp : target.resolvedAt,
        timeline: updatedTimeline,
      },
      actorName
    );

    // Notify student
    db.notifications.create({
      user_id: target.student_id || target.submittedBy.id,
      title: `Status Updated: ${target.trackingNumber}`,
      message: `Issue "${target.title}" is now ${newStatus.replace('_', ' ').toUpperCase()}.`,
      type: 'complaint_update',
      created_at: timestamp,
      createdAt: timestamp,
      read: false,
      relatedComplaintId: id,
      link: `/student/complaints/${id}`,
    });
  };

  const assignStaff = (
    complaintId: string,
    staffId: string,
    staffName: string,
    deptId?: string,
    deptName?: string
  ) => {
    const timestamp = new Date().toISOString();
    const target = complaints.find(c => c.id === complaintId);
    if (!target) return;

    const targetDept = deptId ? departments.find(d => d.id === deptId) : undefined;
    const finalDeptName = deptName || (targetDept ? targetDept.name : target.assignedDepartmentName);
    const finalDeptId = deptId || (targetDept ? targetDept.id : target.assignedDepartmentId);

    const updatedTimeline = [
      ...target.timeline,
      {
        id: `tl_${Date.now()}`,
        timestamp,
        actorName: 'Dispatcher',
        actorRole: 'admin' as UserRole,
        title: `Assigned to ${staffName}`,
        description: `Work order dispatched to ${staffName} (${finalDeptName}).`,
        statusChange: 'assigned' as ComplaintStatus,
      },
    ];

    db.complaints.update(
      complaintId,
      {
        assignedStaffId: staffId,
        assigned_staff_id: staffId,
        assignedStaffName: staffName,
        assignedDepartmentId: finalDeptId,
        department_id: finalDeptId,
        assignedDepartmentName: finalDeptName,
        status: target.status === 'submitted' || target.status === 'ai_classified' ? 'assigned' : target.status,
        updatedAt: timestamp,
        timeline: updatedTimeline,
      },
      'Dispatcher'
    );

    // Notify student about technician assignment
    db.notifications.create({
      user_id: target.student_id || target.submittedBy.id,
      title: `Staff Assigned: ${target.trackingNumber}`,
      message: `Technician ${staffName} from ${finalDeptName} has been assigned to your ticket.`,
      type: 'complaint_update',
      created_at: timestamp,
      createdAt: timestamp,
      read: false,
      relatedComplaintId: complaintId,
      link: `/student/complaints/${complaintId}`,
    });
  };

  const assignComplaint = assignStaff;

  const addComment = (
    complaintId: string,
    authorId: string,
    authorName: string,
    authorRole: UserRole,
    content: string,
    avatarUrl?: string,
    isInternalNote = false
  ) => {
    const target = complaints.find(c => c.id === complaintId);
    if (!target) return;

    const timestamp = new Date().toISOString();
    const newComment = {
      id: `comm_${Date.now()}`,
      authorId,
      authorName,
      authorRole,
      avatarUrl,
      createdAt: timestamp,
      content,
      isInternalNote,
    };

    db.complaints.update(
      complaintId,
      {
        comments: [...target.comments, newComment],
      },
      authorName
    );
  };

  const upvoteComplaint = (complaintId: string) => {
    const target = complaints.find(c => c.id === complaintId);
    if (!target) return;

    const userUpvoted = !target.userUpvoted;
    db.complaints.update(complaintId, {
      upvotes: (target.upvotes || 0) + (userUpvoted ? 1 : -1),
      userUpvoted,
    });
  };

  const submitSatisfactionRating = (complaintId: string, rating: number, feedback?: string) => {
    db.complaints.update(complaintId, {
      satisfactionRating: rating,
      satisfactionFeedback: feedback,
    });
  };

  const addLostFoundItem = (item: Omit<LostFoundItem, 'id' | 'status' | 'created_at'>) => {
    db.lostFound.create({
      ...item,
      status: 'active',
    });
  };

  const markLostFoundClaimed = (id: string) => {
    db.lostFound.update(id, { status: 'claimed' });
  };

  const markNotificationAsRead = (id: string) => {
    db.notifications.markAsRead(id);
  };

  const markAllNotificationsAsRead = (userId?: string) => {
    db.notifications.markAllAsRead(userId);
  };

  const sendBroadcastNotification = (title: string, message: string, priority: 'normal' | 'urgent' = 'normal') => {
    db.notifications.create({
      user_id: 'broadcast_all',
      title,
      message,
      type: 'campus_alert',
      priority,
      read: false,
    });
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    db.departments.update(id, updates);
  };

  const resetToDefaultData = () => {
    db.resetToDefaults();
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        departments,
        locations,
        lostFoundItems,
        notifications,
        recurringClusters,
        statusHistory,
        unreadNotificationCount,
        submitComplaint,
        createComplaint,
        updateComplaintStatus,
        assignStaff,
        assignComplaint,
        addComment,
        upvoteComplaint,
        submitSatisfactionRating,
        addLostFoundItem,
        markLostFoundClaimed,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendBroadcastNotification,
        updateDepartment,
        resetToDefaultData,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};

