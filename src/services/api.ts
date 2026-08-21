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

const API_BASE = '/api';

// Helper for API requests
async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('smartfix_auth_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${res.status}`;
    const err = new Error(errorMsg);
    (err as any).status = res.status;
    (err as any).data = data;
    throw err;
  }

  return data;
}

// Convert Server Complaint Entity to Frontend Model
function mapComplaintFromServer(serverComp: any): Complaint {
  return {
    id: serverComp.id,
    trackingNumber: serverComp.tracking_number || serverComp.trackingNumber || `SF-${serverComp.id.substring(5, 8)}`,
    student_id: serverComp.student_id,
    title: serverComp.title,
    description: serverComp.description,
    original_message: serverComp.original_message || serverComp.description,
    issue: serverComp.issue || serverComp.title,
    category: serverComp.category,
    location: serverComp.location,
    building: serverComp.building || serverComp.location,
    roomNumber: serverComp.room_number || serverComp.roomNumber,
    priority: serverComp.priority,
    department_id: serverComp.department_id,
    assigned_staff_id: serverComp.assigned_staff_id,
    status: serverComp.status,
    duplicateCount: serverComp.duplicate_count ?? 0,
    aiAnalysis: serverComp.ai_analysis,
    timeline: serverComp.timeline || [],
    comments: serverComp.comments || [],
    attachments: serverComp.attachments || [],
    upvotes: serverComp.upvotes ?? 1,
    upvotedBy: serverComp.upvoted_by || [],
    userUpvoted: serverComp.userUpvoted,
    satisfactionRating: serverComp.satisfaction_rating,
    satisfactionFeedback: serverComp.satisfaction_feedback,
    is_demo: serverComp.is_demo ?? false,
    createdAt: serverComp.created_at || serverComp.createdAt,
    updatedAt: serverComp.updated_at || serverComp.updatedAt,
    resolvedAt: serverComp.resolved_at || serverComp.resolvedAt,
    created_at: serverComp.created_at,
    updated_at: serverComp.updated_at,

    // Submitter mapping
    submittedBy: serverComp.submittedBy || {
      id: serverComp.student_id,
      name: serverComp.submitter_name || 'Student Submitter',
      role: (serverComp.submitter_role as UserRole) || 'student',
      email: serverComp.submitter_email || 'student@campus.edu',
    },
    assignedDepartmentId: serverComp.department_id,
    assignedDepartmentName: serverComp.assignedDepartmentName || 'Assigned Department',
    assignedStaffId: serverComp.assigned_staff_id,
    assignedStaffName: serverComp.assignedStaffName,
  };
}

// Convert Server User Entity to Frontend Model
function mapUserFromServer(serverUser: any): User {
  return {
    id: serverUser.id,
    name: serverUser.name,
    email: serverUser.email,
    role: serverUser.role,
    department: serverUser.department,
    studentId: serverUser.student_id || serverUser.studentId,
    roomOrOffice: serverUser.room_or_office || serverUser.roomOrOffice,
    phone: serverUser.phone,
    avatar: serverUser.avatar_url || serverUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    avatarUrl: serverUser.avatar_url || serverUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: serverUser.status || 'active',
    created_at: serverUser.created_at,
    createdAt: serverUser.created_at,
    updated_at: serverUser.updated_at,
  };
}

// Convert Server Department Entity
function mapDepartmentFromServer(serverDept: any): Department {
  return {
    id: serverDept.id,
    name: serverDept.name,
    description: serverDept.description,
    status: serverDept.status,
    code: serverDept.code,
    category: serverDept.category,
    headName: serverDept.head_name || serverDept.headName,
    headEmail: serverDept.head_email || serverDept.headEmail,
    contactEmail: serverDept.contact_email || serverDept.contactEmail,
    activeStaffCount: serverDept.active_staff_count ?? 8,
    openTicketsCount: serverDept.open_tickets_count ?? 3,
    slaAvgHours: serverDept.sla_avg_hours ?? 4.0,
    avgResolutionHours: serverDept.sla_avg_hours ?? 4.0,
    slaComplianceRate: serverDept.sla_compliance_rate ?? 97.0,
    slaTargetPercentage: serverDept.sla_compliance_rate ?? 97.0,
    colorTheme: serverDept.color_theme || 'blue',
    created_at: serverDept.created_at,
    createdAt: serverDept.created_at,
  };
}

// Convert Server Notification Entity
function mapNotificationFromServer(serverNotif: any): CampusNotification {
  return {
    id: serverNotif.id,
    user_id: serverNotif.user_id,
    title: serverNotif.title,
    message: serverNotif.message,
    type: serverNotif.type,
    priority: serverNotif.priority,
    read: serverNotif.read,
    relatedComplaintId: serverNotif.related_complaint_id || serverNotif.relatedComplaintId,
    link: serverNotif.link,
    created_at: serverNotif.created_at,
    createdAt: serverNotif.created_at,
  };
}

// Convert Server Lost & Found Entity
function mapLostFoundFromServer(serverLf: any): LostFoundItem {
  return {
    id: serverLf.id,
    reported_by: serverLf.reported_by,
    type: serverLf.type,
    title: serverLf.title,
    description: serverLf.description,
    location: serverLf.location,
    date: serverLf.date,
    status: serverLf.status,
    possible_match: serverLf.possible_match,
    category: serverLf.category,
    contactInfo: serverLf.contact_info || serverLf.contactInfo,
    reportedByName: serverLf.reported_by_name || serverLf.reportedByName,
    imageUrl: serverLf.image_url || serverLf.imageUrl,
    aiSuggestedMatchId: serverLf.possible_match,
    created_at: serverLf.created_at,
    createdAt: serverLf.created_at,
  };
}

export const api = {
  // ==========================================
  // AUTH
  // ==========================================
  auth: {
    login: async (email: string, password?: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
      try {
        const res = await fetchJson<{ success: boolean; user: any; token: string }>(`${API_BASE}/auth/login`, {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        if (res.token && typeof window !== 'undefined') {
          localStorage.setItem('smartfix_auth_token', res.token);
        }
        return { success: true, user: mapUserFromServer(res.user), token: res.token };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    demoLogin: async (role: UserRole): Promise<{ success: boolean; user: User; token: string }> => {
      const res = await fetchJson<{ success: boolean; user: any; token: string }>(`${API_BASE}/auth/demo-login`, {
        method: 'POST',
        body: JSON.stringify({ role }),
      });
      if (res.token && typeof window !== 'undefined') {
        localStorage.setItem('smartfix_auth_token', res.token);
      }
      return { success: true, user: mapUserFromServer(res.user), token: res.token };
    },
    register: async (data: {
      name: string;
      email: string;
      password?: string;
      role: UserRole;
      department?: string;
      studentId?: string;
      roomOrOffice?: string;
      phone?: string;
      avatar?: string;
    }): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
      try {
        const res = await fetchJson<{ success: boolean; user: any; token: string }>(`${API_BASE}/auth/register`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (res.token && typeof window !== 'undefined') {
          localStorage.setItem('smartfix_auth_token', res.token);
        }
        return { success: true, user: mapUserFromServer(res.user), token: res.token };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    getMe: async (): Promise<User | null> => {
      try {
        const res = await fetchJson<{ success: boolean; user: any }>(`${API_BASE}/auth/me`);
        return res.user ? mapUserFromServer(res.user) : null;
      } catch {
        return null;
      }
    },
    logout: async (): Promise<void> => {
      try {
        await fetchJson(`${API_BASE}/auth/logout`, { method: 'POST' });
      } catch {}
      if (typeof window !== 'undefined') {
        localStorage.removeItem('smartfix_auth_token');
      }
    },
  },

  // ==========================================
  // USERS
  // ==========================================
  users: {
    getAll: async (): Promise<User[]> => {
      const res = await fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/users`);
      return (res.data || []).map(mapUserFromServer);
    },
    getById: async (id: string): Promise<User | null> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/users/${id}`);
      return res.data ? mapUserFromServer(res.data) : null;
    },
    create: async (userData: any): Promise<User> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/users`, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return mapUserFromServer(res.data);
    },
    update: async (id: string, updates: Partial<User>): Promise<User> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      return mapUserFromServer(res.data);
    },
    delete: async (id: string): Promise<boolean> => {
      const res = await fetchJson<{ success: boolean }>(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
      });
      return !!res.success;
    },
  },

  // ==========================================
  // DEPARTMENTS
  // ==========================================
  departments: {
    getAll: async (): Promise<Department[]> => {
      const res = await fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/departments`);
      return (res.data || []).map(mapDepartmentFromServer);
    },
    getById: async (id: string): Promise<Department | null> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/departments/${id}`);
      return res.data ? mapDepartmentFromServer(res.data) : null;
    },
    update: async (id: string, updates: Partial<Department>): Promise<Department> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/departments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      return mapDepartmentFromServer(res.data);
    },
  },

  // ==========================================
  // LOCATIONS
  // ==========================================
  locations: {
    getAll: async (): Promise<CampusLocation[]> => {
      const res = await fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/locations`);
      return res.data || [];
    },
  },

  // ==========================================
  // COMPLAINTS
  // ==========================================
  complaints: {
    getAll: async (params?: { student_id?: string; department_id?: string; assigned_staff_id?: string; status?: string }): Promise<Complaint[]> => {
      const query = new URLSearchParams();
      if (params?.student_id) query.set('student_id', params.student_id);
      if (params?.department_id) query.set('department_id', params.department_id);
      if (params?.assigned_staff_id) query.set('assigned_staff_id', params.assigned_staff_id);
      if (params?.status) query.set('status', params.status);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/complaints${qs}`);
      return (res.data || []).map(mapComplaintFromServer);
    },
    getById: async (id: string): Promise<Complaint | null> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/complaints/${id}`);
      return res.data ? mapComplaintFromServer(res.data) : null;
    },
    create: async (data: {
      student_id: string;
      title: string;
      description: string;
      category: string;
      location: string;
      building?: string;
      room_number?: string;
      priority?: string;
      department_id: string;
      assigned_staff_id?: string;
      ai_analysis?: any;
      attachments?: any[];
      is_demo?: boolean;
    }): Promise<Complaint> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/complaints`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return mapComplaintFromServer(res.data);
    },
    update: async (id: string, updates: Partial<Complaint>): Promise<Complaint> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/complaints/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      return mapComplaintFromServer(res.data);
    },
    updateStatus: async (
      id: string,
      status: ComplaintStatus,
      actorName: string,
      actorRole: string,
      note?: string
    ): Promise<Complaint> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/complaints/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, actorName, actorRole, note }),
      });
      return mapComplaintFromServer(res.data);
    },
    assignStaff: async (
      id: string,
      staffId: string,
      staffName: string,
      deptId?: string,
      deptName?: string,
      dispatcherName?: string
    ): Promise<Complaint> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/complaints/${id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ staffId, staffName, deptId, deptName, dispatcherName }),
      });
      return mapComplaintFromServer(res.data);
    },
    addComment: async (
      id: string,
      authorId: string,
      authorName: string,
      authorRole: string,
      content: string,
      avatarUrl?: string,
      isInternalNote = false
    ): Promise<Complaint> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/complaints/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ authorId, authorName, authorRole, content, avatarUrl, isInternalNote }),
      });
      return mapComplaintFromServer(res.data);
    },
    upvote: async (id: string, userId?: string): Promise<Complaint> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/complaints/${id}/upvote`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
      return mapComplaintFromServer(res.data);
    },
    submitRating: async (id: string, rating: number, feedback?: string): Promise<Complaint> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/complaints/${id}/rating`, {
        method: 'POST',
        body: JSON.stringify({ rating, feedback }),
      });
      return mapComplaintFromServer(res.data);
    },
    getHistory: async (id: string): Promise<ComplaintStatusHistory[]> => {
      const res = await fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/complaints/${id}/history`);
      return res.data || [];
    },
  },

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  notifications: {
    getAll: async (userId?: string): Promise<CampusNotification[]> => {
      const qs = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
      const res = await fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/notifications${qs}`);
      return (res.data || []).map(mapNotificationFromServer);
    },
    create: async (notifData: any): Promise<CampusNotification> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/notifications`, {
        method: 'POST',
        body: JSON.stringify(notifData),
      });
      return mapNotificationFromServer(res.data);
    },
    broadcast: async (title: string, message: string, priority: 'normal' | 'urgent' = 'normal'): Promise<void> => {
      await fetchJson(`${API_BASE}/notifications/broadcast`, {
        method: 'POST',
        body: JSON.stringify({ title, message, priority }),
      });
    },
    markAsRead: async (id: string): Promise<void> => {
      await fetchJson(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' });
    },
    markAllAsRead: async (userId?: string): Promise<void> => {
      await fetchJson(`${API_BASE}/notifications/read-all`, {
        method: 'PATCH',
        body: JSON.stringify({ user_id: userId }),
      });
    },
  },

  // ==========================================
  // LOST & FOUND
  // ==========================================
  lostFound: {
    getAll: async (): Promise<LostFoundItem[]> => {
      const res = await fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/lost-found`);
      return (res.data || []).map(mapLostFoundFromServer);
    },
    create: async (itemData: any): Promise<LostFoundItem> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/lost-found`, {
        method: 'POST',
        body: JSON.stringify(itemData),
      });
      return mapLostFoundFromServer(res.data);
    },
    update: async (id: string, updates: Partial<LostFoundItem>): Promise<LostFoundItem> => {
      const res = await fetchJson<{ success: boolean; data: any }>(`${API_BASE}/lost-found/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      return mapLostFoundFromServer(res.data);
    },
  },

  // ==========================================
  // DATABASE HEALTH & RESET
  // ==========================================
  database: {
    health: async (): Promise<{ status: string; persistentStorage: string; stats: any }> => {
      return fetchJson(`${API_BASE}/database/health`);
    },
    reset: async (): Promise<void> => {
      await fetchJson(`${API_BASE}/database/reset`, { method: 'POST' });
    },
  },
};
