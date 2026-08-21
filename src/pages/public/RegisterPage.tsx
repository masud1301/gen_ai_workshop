import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, User, Mail, Lock, Building, GraduationCap, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [room, setRoom] = useState('Hostel Block C, Room 312');
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please fill in required fields', undefined, 'error');
      return;
    }

    setIsLoading(true);
    const res = await register({
      name,
      email,
      password: password || 'password123',
      role,
      department,
      studentId: role === 'student' ? studentId || `ST-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      roomOrOffice: room,
      phone,
    });
    setIsLoading(false);

    if (res.success && res.user) {
      showToast('Registration successful', `Welcome to SmartFix AI, ${name}!`, 'success');
      const target =
        role === 'admin'
          ? '/admin/dashboard'
          : role === 'staff'
          ? '/staff/dashboard'
          : role === 'faculty'
          ? '/faculty/dashboard'
          : '/student/dashboard';
      navigate(target);
    } else {
      showToast('Registration failed', res.error || 'Could not complete registration.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-app text-theme-primary transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white mx-auto mb-4 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-theme-primary">
              Register Campus Account
            </h1>
            <p className="text-xs sm:text-sm text-theme-secondary mt-1">
              Join the unified resolution portal for students, faculty & campus operations
            </p>
          </div>

          <div className="rounded-2xl border border-theme-subtle bg-surface p-6 sm:p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role selector buttons */}
              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1.5">
                  I am a...
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'student', label: 'Student' },
                    { id: 'faculty', label: 'Faculty' },
                    { id: 'staff', label: 'Staff' },
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as UserRole)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        role === r.id
                          ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                          : 'bg-surface-elevated text-theme-secondary border-theme-subtle hover:bg-surface-hover'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-theme-secondary mb-1.5">
                  University Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Student/Faculty ID & Dept */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-theme-secondary mb-1.5">
                    {role === 'student' ? 'Student ID' : 'Employee ID'}
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    placeholder="ST-2026-8812"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-brand-primary font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-theme-secondary mb-1.5">
                    Room / Office Location
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    placeholder="Hostel Block C, Room 312"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-theme-subtle text-center text-xs text-theme-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-primary font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
