import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Mail, KeyRound, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export const ForgotPasswordPage: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    showToast('Reset instructions sent', 'Check your university email inbox', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-app text-theme-primary transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white mx-auto mb-4 shadow-md">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-theme-primary">
              Reset Password
            </h1>
            <p className="text-xs sm:text-sm text-theme-secondary mt-1">
              Enter your university email to receive instant recovery credentials
            </p>
          </div>

          <div className="rounded-2xl border border-theme-subtle bg-surface p-6 sm:p-8 shadow-xl">
            {isSubmitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-theme-primary mb-2">Check Your University Email</h3>
                <p className="text-xs text-theme-secondary mb-6 leading-relaxed">
                  We have dispatched a secure password reset link to <strong className="text-theme-primary">{email}</strong>. The link expires in 15 minutes.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-theme-secondary mb-1.5">
                    University Email Address
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

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  Send Recovery Link
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-4 border-t border-theme-subtle text-center text-xs text-theme-secondary">
                  Remember your password?{' '}
                  <Link to="/login" className="text-brand-primary font-bold hover:underline">
                    Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
