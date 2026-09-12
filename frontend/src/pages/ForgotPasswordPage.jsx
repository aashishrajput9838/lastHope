import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import BrandLogo from '../components/auth/BrandLogo';
import AuthBackground from '../components/auth/AuthBackground';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [devToken, setDevToken] = useState('');

  // Password Reset form states (if dev token available)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const res = await fetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (data.devResetToken) {
        setDevToken(data.devResetToken);
      }
      setFeedback({
        type: 'success',
        message: data.message || 'Reset instructions have been sent.',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Unable to process reset request. Please check your connection.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords must match and be at least 6 characters.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: devToken,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResetSuccess(true);
        setFeedback({ type: 'success', message: 'Password has been reset successfully!' });
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to reset password.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error resetting password.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <AuthBackground />

      <main className="auth-card animate-fade-in" role="main">
        <header className="auth-header">
          <BrandLogo size="default" />
          <h1 className="auth-title">Reset password</h1>
          <p className="auth-subtitle">
            Enter your email to receive recovery instructions.
          </p>
        </header>

        {feedback.message && (
          <div
            className={feedback.type === 'error' ? 'auth-banner-error' : 'auth-banner-success'}
            role="alert"
          >
            {feedback.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {!devToken ? (
          <form onSubmit={handleForgotSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="forgot-email" className="form-label">
                Your email
              </label>
              <div className="input-wrapper">
                <span className="input-icon-left" aria-hidden="true">
                  <Mail size={18} />
                </span>
                <input
                  id="forgot-email"
                  type="email"
                  className="form-input"
                  placeholder="alex@lasthope.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-forgot-submit"
              className={`btn-primary ${!email.trim() || isSubmitting ? 'btn-disabled' : ''}`}
              disabled={!email.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <div className="spinner" />
              ) : (
                <>
                  <span>Send Reset Instructions</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : !resetSuccess ? (
          <form onSubmit={handleResetSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="reset-new-password" className="form-label">
                New password
              </label>
              <div className="input-wrapper">
                <span className="input-icon-left" aria-hidden="true">
                  <Lock size={18} />
                </span>
                <input
                  id="reset-new-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input has-right-btn"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-action-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reset-confirm-password" className="form-label">
                Confirm new password
              </label>
              <div className="input-wrapper">
                <span className="input-icon-left" aria-hidden="true">
                  <Lock size={18} />
                </span>
                <input
                  id="reset-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-confirm-reset"
              className={`btn-primary ${newPassword.length < 6 || isSubmitting ? 'btn-disabled' : ''}`}
              disabled={newPassword.length < 6 || isSubmitting}
            >
              {isSubmitting ? <div className="spinner" /> : <span>Update Password</span>}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', width: '100%' }}>
              Proceed to Sign In
            </Link>
          </div>
        )}

        <div className="auth-sub-links">
          <Link to="/login" className="auth-switch-link" style={{ fontSize: '13.5px' }}>
            ← Back to Sign In
          </Link>
        </div>

        <footer className="auth-footer-terms">
          By continuing, you agree to lastHope's{' '}
          <a href="#terms" onClick={(e) => e.preventDefault()}>
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="#privacy" onClick={(e) => e.preventDefault()}>
            Privacy Policy
          </a>
          .
        </footer>
      </main>
    </div>
  );
}
