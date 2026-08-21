import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';

// Layout & Security
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ReportIssuePage } from './pages/student/ReportIssuePage';
import { StudentComplaintsPage } from './pages/student/StudentComplaintsPage';
import { ComplaintDetailPage } from './pages/student/ComplaintDetailPage';
import { StudentNotificationsPage } from './pages/student/StudentNotificationsPage';
import { LostAndFoundPage } from './pages/student/LostAndFoundPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { StudentSettingsPage } from './pages/student/StudentSettingsPage';

// Faculty Pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { FacultyRequestsPage } from './pages/faculty/FacultyRequestsPage';
import { FacultyClassroomsPage } from './pages/faculty/FacultyClassroomsPage';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffQueuePage } from './pages/staff/StaffQueuePage';
import { StaffHistoryPage } from './pages/staff/StaffHistoryPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminDepartmentsPage } from './pages/admin/AdminDepartmentsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ComplaintProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Marketing & Auth */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Dashboard Shell */}
                <Route
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  {/* Student Routes */}
                  <Route
                    path="/student/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/report"
                    element={
                      <ProtectedRoute allowedRoles={['student', 'faculty', 'staff', 'admin']}>
                        <ReportIssuePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/complaints"
                    element={
                      <ProtectedRoute allowedRoles={['student', 'faculty', 'staff', 'admin']}>
                        <StudentComplaintsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/complaints/:id"
                    element={
                      <ProtectedRoute allowedRoles={['student', 'faculty', 'staff', 'admin']}>
                        <ComplaintDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/notifications"
                    element={
                      <ProtectedRoute allowedRoles={['student', 'faculty', 'staff', 'admin']}>
                        <StudentNotificationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/lost-found"
                    element={
                      <ProtectedRoute allowedRoles={['student', 'faculty', 'staff', 'admin']}>
                        <LostAndFoundPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/profile"
                    element={
                      <ProtectedRoute allowedRoles={['student', 'faculty', 'staff', 'admin']}>
                        <StudentProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/settings"
                    element={
                      <ProtectedRoute allowedRoles={['student', 'faculty', 'staff', 'admin']}>
                        <StudentSettingsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Faculty Routes */}
                  <Route
                    path="/faculty/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['faculty']}>
                        <FacultyDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/faculty/requests"
                    element={
                      <ProtectedRoute allowedRoles={['faculty']}>
                        <FacultyRequestsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/faculty/classrooms"
                    element={
                      <ProtectedRoute allowedRoles={['faculty']}>
                        <FacultyClassroomsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Staff Routes */}
                  <Route
                    path="/staff/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['staff']}>
                        <StaffDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/staff/queue"
                    element={
                      <ProtectedRoute allowedRoles={['staff']}>
                        <StaffQueuePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/staff/tickets"
                    element={
                      <ProtectedRoute allowedRoles={['staff']}>
                        <StaffQueuePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/staff/history"
                    element={
                      <ProtectedRoute allowedRoles={['staff']}>
                        <StaffHistoryPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminAnalyticsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/departments"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDepartmentsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminUsersPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ComplaintProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
