import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { databaseService } from './server/services/databaseService';
import {
  analyzeComplaintWithGemini,
  generateAdminAIInsights,
  AI_DISCLAIMER_TEXT,
} from './server/services/aiService';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Auth helper middleware
function getAuthUser(req: express.Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return databaseService.auth.verifySession(token);
}

// ==========================================
// AUTHENTICATION API ROUTES
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, error: 'Valid email address is required.' });
  }

  const result = databaseService.auth.login(email, password);
  if (!result.success) {
    return res.status(401).json(result);
  }

  res.json(result);
});

app.post('/api/auth/demo-login', (req, res) => {
  const { role } = req.body;
  const validRoles = ['student', 'faculty', 'staff', 'admin'];
  const targetRole = validRoles.includes(role) ? role : 'student';

  const result = databaseService.auth.demoLogin(targetRole as any);
  res.json({ success: true, ...result });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, department, studentId, roomOrOffice, phone, avatar } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required.' });
  }

  const existing = databaseService.users.getByEmail(email);
  if (existing) {
    return res.status(409).json({ success: false, error: 'An account with this email address already exists.' });
  }

  const newUser = databaseService.users.create({
    name,
    email,
    password,
    role: role || 'student',
    department,
    student_id: studentId,
    room_or_office: roomOrOffice,
    phone,
    avatar_url: avatar,
  });

  const session = databaseService.auth.demoLogin(newUser.role);
  res.status(201).json({ success: true, user: newUser, token: session.token });
});

app.get('/api/auth/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Not authenticated or session expired.' });
  }
  res.json({ success: true, user });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    databaseService.auth.logout(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ==========================================
// USERS API ROUTES
// ==========================================
app.get('/api/users', (req, res) => {
  const users = databaseService.users.getAll();
  res.json({ success: true, count: users.length, data: users });
});

app.get('/api/users/:id', (req, res) => {
  const user = databaseService.users.getById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }
  res.json({ success: true, data: user });
});

app.post('/api/users', (req, res) => {
  const { name, email, password, role, department, studentId, roomOrOffice, phone, avatarUrl, status } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required.' });
  }

  const existing = databaseService.users.getByEmail(email);
  if (existing) {
    return res.status(409).json({ success: false, error: 'Email already registered.' });
  }

  const user = databaseService.users.create({
    name,
    email,
    password,
    role: role || 'student',
    department,
    student_id: studentId,
    room_or_office: roomOrOffice,
    phone,
    avatar_url: avatarUrl,
    status: status || 'active',
  });

  res.status(201).json({ success: true, data: user });
});

app.patch('/api/users/:id', (req, res) => {
  const updated = databaseService.users.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }
  res.json({ success: true, data: updated });
});

app.delete('/api/users/:id', (req, res) => {
  const success = databaseService.users.delete(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'User not found or cannot be deleted.' });
  }
  res.json({ success: true, message: 'User deleted.' });
});

// ==========================================
// DEPARTMENTS API ROUTES
// ==========================================
app.get('/api/departments', (req, res) => {
  const depts = databaseService.departments.getAll();
  res.json({ success: true, count: depts.length, data: depts });
});

app.get('/api/departments/:id', (req, res) => {
  const dept = databaseService.departments.getById(req.params.id);
  if (!dept) {
    return res.status(404).json({ success: false, error: 'Department not found.' });
  }
  res.json({ success: true, data: dept });
});

app.patch('/api/departments/:id', (req, res) => {
  const updated = databaseService.departments.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Department not found.' });
  }
  res.json({ success: true, data: updated });
});

// ==========================================
// LOCATIONS API ROUTES
// ==========================================
app.get('/api/locations', (req, res) => {
  const locs = databaseService.locations.getAll();
  res.json({ success: true, count: locs.length, data: locs });
});

// ==========================================
// COMPLAINTS API ROUTES
// ==========================================
app.get('/api/complaints', (req, res) => {
  const { student_id, department_id, assigned_staff_id, status, category, search } = req.query;
  const list = databaseService.complaints.getAll({
    student_id: student_id as string,
    department_id: department_id as string,
    assigned_staff_id: assigned_staff_id as string,
    status: status as string,
    category: category as string,
    search: search as string,
  });
  res.json({ success: true, count: list.length, data: list });
});

app.get('/api/complaints/:id', (req, res) => {
  const complaint = databaseService.complaints.getById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, error: 'Complaint ticket not found.' });
  }
  res.json({ success: true, data: complaint });
});

app.post('/api/complaints', (req, res) => {
  try {
    console.log('[COMPLAINT CREATE] Request received');
    const authUser = getAuthUser(req);
    console.log('[COMPLAINT CREATE] Authenticated user:', authUser ? `${authUser.name} (${authUser.id}, ${authUser.role})` : 'Demo / No Bearer Token Provided');
    console.log('[COMPLAINT CREATE] Request body:', JSON.stringify(req.body, null, 2));

    const {
      student_id,
      studentId,
      title,
      description,
      original_message,
      originalMessage,
      issue,
      category,
      standardCategory,
      location,
      building,
      room_number,
      roomNumber,
      priority,
      standardPriority,
      department_id,
      departmentId,
      assignedDepartmentId,
      assigned_staff_id,
      assignedStaffId,
      status,
      ai_analysis,
      aiAnalysis,
      attachments,
      is_demo,
      submittedBy,
    } = req.body;

    const resolvedStudentId = student_id || studentId || submittedBy?.id || authUser?.id || 'usr_student_01';
    const resolvedTitle = title || issue || 'Campus Maintenance Request';
    const resolvedDescription = description || original_message || originalMessage || issue || '';
    const resolvedCategory = category || standardCategory || 'Other';
    const resolvedLocation = location || building || 'Campus Facility';
    const resolvedDeptId = department_id || departmentId || assignedDepartmentId || 'dept_facility_management';

    if (!resolvedStudentId || !resolvedTitle || !resolvedDescription || !resolvedCategory || !resolvedLocation || !resolvedDeptId) {
      console.error('[COMPLAINT CREATE] Validation failed: missing required fields', {
        resolvedStudentId,
        resolvedTitle,
        resolvedDescription,
        resolvedCategory,
        resolvedLocation,
        resolvedDeptId,
      });
      return res.status(400).json({
        success: false,
        error: 'Missing required complaint fields (student_id, title, description, category, location, department_id).',
      });
    }

    console.log('[COMPLAINT CREATE] Validation passed');
    console.log('[COMPLAINT CREATE] Writing to database');

    const created = databaseService.complaints.create({
      student_id: resolvedStudentId,
      title: resolvedTitle,
      description: resolvedDescription,
      original_message: original_message || originalMessage || resolvedDescription,
      issue: issue || resolvedTitle,
      category: resolvedCategory,
      location: resolvedLocation,
      building: building || resolvedLocation,
      room_number: room_number || roomNumber,
      priority: priority || standardPriority || 'Medium',
      department_id: resolvedDeptId,
      assigned_staff_id: assigned_staff_id || assignedStaffId,
      status: status || 'Submitted',
      ai_analysis: ai_analysis || aiAnalysis,
      attachments: attachments || [],
      is_demo: is_demo ?? true,
    });

    console.log('[COMPLAINT CREATE] Database write successful:', created.id, created.tracking_number);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    console.error('[COMPLAINT CREATE] Database write error:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to create complaint in database.',
    });
  }
});

app.patch('/api/complaints/:id', (req, res) => {
  const updated = databaseService.complaints.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Complaint not found.' });
  }
  res.json({ success: true, data: updated });
});

app.patch('/api/complaints/:id/status', (req, res) => {
  const { status, actorName, actorRole, note } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, error: 'Target status is required.' });
  }

  const updated = databaseService.complaints.updateStatus(
    req.params.id,
    status,
    actorName || 'Campus Maintenance',
    actorRole || 'staff',
    note
  );

  if (!updated) {
    return res.status(404).json({ success: false, error: 'Complaint not found.' });
  }

  res.json({ success: true, data: updated });
});

app.patch('/api/complaints/:id/assign', (req, res) => {
  const { staffId, staffName, deptId, deptName, dispatcherName } = req.body;
  if (!staffId || !staffName) {
    return res.status(400).json({ success: false, error: 'staffId and staffName are required.' });
  }

  const updated = databaseService.complaints.assignStaff(
    req.params.id,
    staffId,
    staffName,
    deptId,
    deptName,
    dispatcherName || 'Dispatcher'
  );

  if (!updated) {
    return res.status(404).json({ success: false, error: 'Complaint not found.' });
  }

  res.json({ success: true, data: updated });
});

app.post('/api/complaints/:id/comments', (req, res) => {
  const { authorId, authorName, authorRole, content, avatarUrl, isInternalNote } = req.body;
  if (!authorId || !authorName || !content) {
    return res.status(400).json({ success: false, error: 'authorId, authorName, and content are required.' });
  }

  const updated = databaseService.complaints.addComment(
    req.params.id,
    authorId,
    authorName,
    authorRole || 'staff',
    content,
    avatarUrl,
    isInternalNote ?? false
  );

  if (!updated) {
    return res.status(404).json({ success: false, error: 'Complaint not found.' });
  }

  res.json({ success: true, data: updated });
});

app.post('/api/complaints/:id/upvote', (req, res) => {
  const { userId } = req.body;
  const updated = databaseService.complaints.upvote(req.params.id, userId);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Complaint not found.' });
  }
  res.json({ success: true, data: updated });
});

app.post('/api/complaints/:id/rating', (req, res) => {
  const { rating, feedback } = req.body;
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, error: 'Rating must be an integer between 1 and 5.' });
  }

  const updated = databaseService.complaints.submitRating(req.params.id, rating, feedback);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Complaint not found.' });
  }
  res.json({ success: true, data: updated });
});

app.get('/api/complaints/:id/history', (req, res) => {
  const history = databaseService.history.getByComplaintId(req.params.id);
  res.json({ success: true, count: history.length, data: history });
});

// ==========================================
// NOTIFICATIONS API ROUTES
// ==========================================
app.get('/api/notifications', (req, res) => {
  const { user_id } = req.query;
  const list = databaseService.notifications.getAll(user_id as string);
  res.json({ success: true, count: list.length, data: list });
});

app.post('/api/notifications', (req, res) => {
  const { user_id, title, message, type, priority, related_complaint_id, link } = req.body;
  if (!user_id || !title || !message) {
    return res.status(400).json({ success: false, error: 'user_id, title, and message are required.' });
  }

  const created = databaseService.notifications.create({
    user_id,
    title,
    message,
    type,
    priority,
    related_complaint_id,
    link,
  });

  res.status(201).json({ success: true, data: created });
});

app.post('/api/notifications/broadcast', (req, res) => {
  const { title, message, priority } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, error: 'title and message are required for broadcast.' });
  }

  databaseService.notifications.broadcast(title, message, priority || 'normal');
  res.json({ success: true, message: 'Broadcast alert sent to all campus users.' });
});

app.patch('/api/notifications/:id/read', (req, res) => {
  const ok = databaseService.notifications.markAsRead(req.params.id);
  if (!ok) {
    return res.status(404).json({ success: false, error: 'Notification not found.' });
  }
  res.json({ success: true, message: 'Marked as read.' });
});

app.patch('/api/notifications/read-all', (req, res) => {
  const { user_id } = req.body;
  databaseService.notifications.markAllAsRead(user_id);
  res.json({ success: true, message: 'All notifications marked as read.' });
});

// ==========================================
// LOST & FOUND API ROUTES
// ==========================================
app.get('/api/lost-found', (req, res) => {
  const items = databaseService.lostFound.getAll();
  res.json({ success: true, count: items.length, data: items });
});

app.post('/api/lost-found', (req, res) => {
  const {
    reported_by,
    type,
    title,
    description,
    location,
    date,
    category,
    contact_info,
    reported_by_name,
    image_url,
    possible_match,
  } = req.body;

  if (!reported_by || !type || !title || !description || !location) {
    return res.status(400).json({ success: false, error: 'Missing required lost & found item fields.' });
  }

  const created = databaseService.lostFound.create({
    reported_by,
    type,
    title,
    description,
    location,
    date,
    category,
    contact_info,
    reported_by_name,
    image_url,
    possible_match,
  });

  res.status(201).json({ success: true, data: created });
});

app.patch('/api/lost-found/:id', (req, res) => {
  const updated = databaseService.lostFound.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Lost & Found item not found.' });
  }
  res.json({ success: true, data: updated });
});

// ==========================================
// DATABASE DIAGNOSTICS & RESET
// ==========================================
app.get('/api/database/health', (req, res) => {
  res.json({
    status: databaseService.isHealthy() ? 'ok' : 'degraded',
    persistentStorage: 'server-filesystem',
    stats: databaseService.getStats(),
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/database/reset', (req, res) => {
  databaseService.resetToSeeds();
  res.json({ success: true, message: 'Database reset to initial campus demo seeds.' });
});

// Health endpoint
app.get('/api/health', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
  res.json({
    status: 'ok',
    llmConfigured: hasKey,
    model: 'gemini-3.7-flash',
    timestamp: new Date().toISOString()
  });
});

// AI Complaint Analysis Endpoint
app.post('/api/ai/analyze-complaint', async (req, res) => {
  const { text, location: userLocation } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Complaint text is required for AI analysis.',
      code: 'MISSING_TEXT'
    });
  }

  try {
    const existingComplaints = databaseService.complaints.getAll();
    const result = await analyzeComplaintWithGemini(text, userLocation, existingComplaints);

    return res.json({
      success: true,
      source: result.source,
      model: result.modelName,
      fallback: result.fallbackUsed,
      error: result.fallbackReason,
      data: result,
    });
  } catch (error: any) {
    console.error('API /api/ai/analyze-complaint unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Internal server error analyzing complaint.',
    });
  }
});

// Admin AI Insights Endpoint
app.get('/api/ai/admin-insights', async (req, res) => {
  try {
    const complaints = databaseService.complaints.getAll();
    const departments = databaseService.departments.getAll();
    const insightsResult = await generateAdminAIInsights(complaints, departments);

    return res.json({
      success: true,
      data: insightsResult,
    });
  } catch (error: any) {
    console.error('API /api/ai/admin-insights error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Error generating administrative AI insights.',
    });
  }
});

// Campus Assistant Q&A endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return res.json({
      reply: `SmartFix AI received your query: "${query}". You can report maintenance issues, track real-time resolution SLAs, search campus work orders, or claim lost items across all campus zones.`
    });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const candidateModels = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let text = '';

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: `You are the friendly, helpful AI Campus Assistant for SmartFix at our university.
Answer this student question clearly in 2-4 sentences:
"${query}"
Provide practical campus instructions (e.g. how to report Wi-Fi, classroom AV defects, lost items, hostel plumbing, and security helplines).`,
        });
        if (response.text) {
          text = response.text;
          break;
        }
      } catch (e) {
        // try next candidate model
      }
    }

    res.json({
      reply: text || 'I am ready to help you submit and track campus issues.'
    });
  } catch (err: any) {
    res.json({
      reply: `I can help you navigate campus tickets, report facility repairs, or check SLA status across your department queue.`
    });
  }
});

// Vite middleware & Static Serving setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartFix Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
