import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/auth/BrandLogo';
import AuthBackground from '../components/auth/AuthBackground';
import SocialButtons from '../components/auth/SocialButtons';

export default function SignupPage() {
  const navigate = useNavigate();
  const { loginWithGoogle, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    setServerError('');
    setIsSubmitting(true);
    const result = await loginWithGoogle();
    setIsSubmitting(false);

    if (result.success) {
      navigate('/game', { replace: true });
    } else if (result.error && !result.error.includes('cancelled')) {
      setServerError(result.error);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setServerError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setServerError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setServerError('Password must be at least 6 characters.');
      return;
    }

    setServerError('');
    setIsSubmitting(true);
    const result = await register(name.trim(), email.trim(), password, confirmPassword);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/game', { replace: true });
    } else {
      setServerError(result.error || 'Registration failed. Please check your information.');
    }
  };

  return (
    <div className="auth-page-container">
      <AuthBackground />

      <main className="auth-card animate-fade-in" role="main" style={{ maxWidth: '480px' }}>
        {/* Brand Header */}
        <header className="auth-header">
          <BrandLogo size="default" />
          <h1 className="auth-title">Welcome to lastHope</h1>
          <p className="auth-subtitle">Create your barista profile and enter the café.</p>
        </header>

        {/* Server Error Alert */}
        {serverError && (
          <div className="auth-banner-error" role="alert">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Google Sign-In Action */}
        <div style={{ marginTop: '8px', marginBottom: '14px' }}>
          {isSubmitting && !showEmailForm ? (
            <button
              type="button"
              className="btn-primary"
              disabled
              style={{ width: '100%', height: '48px' }}
            >
              <div className="spinner" />
              <span>Connecting with Google...</span>
            </button>
          ) : (
            <SocialButtons onGoogleClick={handleGoogleSignIn} />
          )}
        </div>

        {/* Divider / Toggle */}
        <div className="auth-divider" style={{ margin: '14px 0 16px' }}>
          <span>OR</span>
        </div>

        {!showEmailForm ? (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowEmailForm(true)}
            style={{ width: '100%', height: '46px', fontSize: '13.5px' }}
          >
            Create account with Email
          </button>
        ) : (
          <form onSubmit={handleEmailSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">
                Barista Name
              </label>
              <div className="input-wrapper">
                <span className="input-icon-left">
                  <User size={18} />
                </span>
                <input
                  id="signup-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex Coffee"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">
                Email Address
              </label>
              <div className="input-wrapper">
                <span className="input-icon-left">
                  <Mail size={18} />
                </span>
                <input
                  id="signup-email"
                  type="email"
                  className="form-input"
                  placeholder="alex@lasthope.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">
                Password
              </label>
              <div className="input-wrapper">
                <span className="input-icon-left">
                  <Lock size={18} />
                </span>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input has-right-btn"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="input-action-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm-password">
                Confirm Password
              </label>
              <div className="input-wrapper">
                <span className="input-icon-left">
                  <Lock size={18} />
                </span>
                <input
                  id="signup-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{ marginTop: '4px' }}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register & Enter Game</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowEmailForm(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '12.5px',
                cursor: 'pointer',
                textAlign: 'center',
                marginTop: '6px',
              }}
            >
              ← Back to 1-click Google sign-up
            </button>
          </form>
        )}

        {/* Switch to Login */}
        <div className="auth-sub-links" style={{ marginTop: '18px' }}>
          <p className="auth-switch-text">
            Already have an account?
            <Link to="/login" className="auth-switch-link">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer Terms */}
        <footer className="auth-footer-terms" style={{ marginTop: '20px' }}>
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
